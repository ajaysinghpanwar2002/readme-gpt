import axios from 'axios';
import AdmZip from 'adm-zip';
import fs from 'fs';

export const getRepoDetails = async (req, res) => {
    const { githubname, reponame } = req.params;

    const downloadRepositoryFiles = async (githubname, reponame) => {
        try {
            const response = await axios.get(`https://api.github.com/repos/${githubname}/${reponame}/zipball`, {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
                responseType: 'stream',
            });

            const writeStream = fs.createWriteStream('repository.zip');

            response.data.pipe(writeStream);

            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            console.log('Repository files downloaded successfully!');
        } catch (error) {
            console.error('Error downloading repository files:', error.message);
        }
    };

    const extractFilesAndCheckPackageJson = async (archiveFilePath) => {
        try {
            const zip = new AdmZip(archiveFilePath);
            const targetDirectory = './extracted-files';

            zip.extractAllTo(targetDirectory, /* overwrite */ true);

            const packageJsonPath = findPackageJson(targetDirectory);

            if (packageJsonPath) {
                const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
                console.log(packageJsonContent);
            } else {
                console.log('No package.json found in the extracted files.');
            }
        } catch (error) {
            console.error('Error extracting files and checking package.json:', error.message);
        }
    };

    const findPackageJson = (directoryPath) => {
        const searchPackageJson = (directory) => {
            const files = fs.readdirSync(directory);
            for (const file of files) {
                const filePath = `${directory}/${file}`;

                if (file === 'package.json') {
                    return filePath;
                }

                if (fs.statSync(filePath).isDirectory()) {
                    const foundPackageJson = searchPackageJson(filePath);
                    if (foundPackageJson) {
                        return foundPackageJson;
                    }
                }
            }
            return null;
        };

        return searchPackageJson(directoryPath);
    };

    await downloadRepositoryFiles(githubname, reponame); 
    await extractFilesAndCheckPackageJson('repository.zip');

    res.send(`GitHub Name: ${githubname}, Repo Name: ${reponame}`);
};
