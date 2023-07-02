import axios from 'axios';
import AdmZip from 'adm-zip';
import fs from 'fs';
import { SERVER_URL } from '../constant.js'
import fsExtra from 'fs-extra';

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

            zip.extractAllTo(targetDirectory, true);

            const packageJsonPath = findPackageJson(targetDirectory);

            if (packageJsonPath) {
                const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
                console.log(packageJsonContent);
                return packageJsonContent;
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

    try {
        await downloadRepositoryFiles(githubname, reponame);
        const packageJsonContent = await extractFilesAndCheckPackageJson('repository.zip');

        if (packageJsonContent) {
            const gptResponse = await axios.post(`${SERVER_URL}/gpt`, { packageJsonContent });
            console.log('Response from gpt:', gptResponse.data);
            res.send(gptResponse.data);
        } else {
            res.status(404).send('No package.json found in the repository.');
        }

        // Delete the repository.zip file
        await fs.promises.unlink('repository.zip');

        // Delete the extracted-files directory
        await fsExtra.remove('./extracted-files');

    } catch (error) {
        console.error('Error processing repository details:', error.message);
        res.status(500).send('Internal server error.');
    }
};
