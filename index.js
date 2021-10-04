const core = require("@actions/core");
const slugify = require("slugify");
const frontmatter = require('@github-docs/frontmatter');
const fs = require("fs").promises;

/**
 * Checks changed files against relevant directories.
 *
 * @param files
 * @param directories
 * @returns {boolean}
 */
const filesInDirectories = (files, directories) =>
  files.length &&
  files
    .split(",")
    .some((file) => directories.some((directory) => file.includes(directory)));

async function action() {
  const files = core.getInput("files", { required: true });
  const directories = core.getMultilineInput("directories", { required: true });

  // Check that the modified file is in a watched directory
  if (files.length && filesInDirectories(files,directories)) {
    for (const [target] of files.split(",")) {
      // Load markdown file as string
      const markdown = (await fs.readFile(target)).toString();

      // Validation schema
      // https://github.com/flatiron/revalidator
      const schema = {
        properties: {
          title: {
            type: 'string',
            required: true
          },
          meaning_of_life: {
            type: 'number',
            minimum: 40,
            maximum: 50
          }
        }
      }

      // Check the Markdown against the schema and return any errors
      core.notice(`Testing Markdown schema...`);
      const { data, content, errors } = frontmatter(markdown,{schema,target});

      if (errors && errors.length > 0) {
        console.log(errors);
        core.error(JSON.stringify(errors));
        core.setFailed(JSON.stringify(errors));
      }

      // Set the output of the action to be the metadata
      for (let k in data) {
        core.setOutput(slugify(k, { lower: true, strict: true }), parsed.data[k]);
      }
    }
  }
}

if (require.main === module) {
  action();
}

module.exports = action;
