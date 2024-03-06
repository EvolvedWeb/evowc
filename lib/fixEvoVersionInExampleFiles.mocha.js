import { expect } from 'chai';
import esmock from 'esmock';
const modulePath = './fixEvoVersionInExampleFiles.js';


describe('fixEvoVersionInExampleFiles tests', () => {
  it('should handle a simple string', async () => {
    const mockFs = {
      promises: {
        readFile(/* fName */) {
          return `import "./dogs.js";\nimport "../EvoElement.js";\nimport "../EvoRouter.js";\n`;
        },
        // eslint-disable-next-line no-unused-vars
        async writeFile(fName, data, options = null) {
          const expected = 'import "./dogs.js";\nimport "../Evo-1.2.3/EvoElement.js";\nimport "../Evo-1.2.3/EvoRouter.js";\n';
          expect(data).to.equal(expected);
        }
      }
    };
    const mockGetFileArrayFromGlob = {
      getFileArrayFromGlob() {
        return ['somefile.js'];
      }
    }

    const { fixEvoVersionInExampleFiles } = await esmock(modulePath, {
      'fs': mockFs,
      './getFileArrayFromGlob.js': mockGetFileArrayFromGlob
    });

    await fixEvoVersionInExampleFiles('/name', '1.2.3');
  });

  it('should handle a existing version string', async () => {
    const mockFs = {
      promises: {
        readFile(/* fName */) {
          return 'import "./dogs.js";\nimport "../Evo-1.2.3/EvoElement.js";\nimport "../Evo-1.2.3/EvoRouter.js";\n';
        },
        // eslint-disable-next-line no-unused-vars
        async writeFile(fName, data, options = null) {
          const expected = 'import "./dogs.js";\nimport "../Evo-2.3.1/EvoElement.js";\nimport "../Evo-2.3.1/EvoRouter.js";\n';
          expect(data).to.equal(expected);
        }
      }
    };
    const mockGetFileArrayFromGlob = {
      getFileArrayFromGlob() {
        return ['somefile.js'];
      }
    }

    const { fixEvoVersionInExampleFiles } = await esmock(modulePath, {
      'fs': mockFs,
      './getFileArrayFromGlob.js': mockGetFileArrayFromGlob
    });

    await fixEvoVersionInExampleFiles('/name', '2.3.1');
  });
});
