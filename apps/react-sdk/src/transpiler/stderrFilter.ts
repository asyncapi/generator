/**
 * Silenced warning patterns that should not be written to stderr.
 * Add patterns here to suppress noisy but harmless warnings.
 */
const SILENCED_WARNINGS = [
    '[BABEL]',
];

/**
 * Creates a stderr filter that silences specific warning patterns.
 * 
 * @param patternsToSilence - Array of string patterns to match and silence
 * @returns Object with apply() and restore() methods to manage the filter
 */
export function createStderrFilter(patternsToSilence: string[]) {
    const originalStderr = process.stderr.write;
    
    const filteredWrite = ((chunk: any, enc?: any, cb?: any): boolean => {
        const msg = chunk.toString();
        
        const shouldSilence = patternsToSilence.some(pattern => msg.includes(pattern));
        
        if (shouldSilence) {
            if (typeof cb === 'function') cb();
            return true;
        }
        
        return originalStderr.call(process.stderr, chunk, enc, cb);
    }) as any;
    
    return {
        apply: () => { process.stderr.write = filteredWrite; },
        restore: () => { process.stderr.write = originalStderr; }
    };
}

/**
 * Gets the default silenced warning patterns.
 */
export function getSilencedWarnings(): string[] {
    return SILENCED_WARNINGS;
}
