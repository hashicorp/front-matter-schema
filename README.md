# Front Down Schema Checker

This Github Action checks the schema of YAML front matter.

## Usage

```yaml
 ---
 name: Check Front Matter
 on: [push]

 jobs:
   front-matter:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v2
         with:
           fetch-depth: 0
       - name: Get changed files
         id: changed-files
         uses: actions/changed-files@v1.1.3
       - name: Front Matter
         id: lint
         uses: hashicorp/font-matter-schema@main
         with:
           files: ${{ steps.changed-files.outputs.all_modified_files }}
           directories: |
             items
```

# TODO:

+ Add schema as input
