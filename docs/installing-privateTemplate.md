How to Fetch template from the private repository. In order to test the generator whether it fetch the template from the private repository or not, we will create a private repository in local and publish a template in the private repository.

**Step 1:** Settuping Private Repository in Local:

Installing [verdaccio](https://verdaccio.org/) using below command:

`npm -i -g verdaccio`


**Step 2:** Starting verdaccio locally and creating a new user:

![Screenshot 2023-12-20 at 3.18.28 PM](https://hackmd.io/_uploads/H1gouVgwa.png)

**Step 3:** Login in localhost:4873

![Screenshot 2023-12-20 at 3.23.17 PM](https://hackmd.io/_uploads/r1votVlDp.png)




**Step 4:** Publishing a template to the private repository using below command:

```
npm publish --registry </templateName>
```
![image](https://hackmd.io/_uploads/SyD_OLeD6.png)


**Step 5:** Fetching the template from the generator using an example.

```javascript
const Generator = require('../lib/generator');
const gen = new Generator('@asyncapi/nodejs-template','asycnapi.yml', __dirname, {debug: true, registry: {url: 'http://localhost:4873/', username: 'aayush', password: '123'}});
gen.installTemplate()
```
You will get complete template information.

![image](https://hackmd.io/_uploads/BkVNOLxvT.png)
