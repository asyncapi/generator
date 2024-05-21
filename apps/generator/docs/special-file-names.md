---
title: "Special file names"
weight: 160
---

We use NPM behind the scenes to download and install the templates. Since NPM will not fetch files like `.gitignore`, you should name them differently. Luckily, the Generator will take care of renaming them back for you. The following is a table of the special file names:

|Special file name|Output file name|
|---|---|
|`{.gitignore}`|`.gitignore`|
|`{.npmignore}`|`.npmignore`|