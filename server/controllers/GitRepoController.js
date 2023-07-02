import axios from 'axios';
import AdmZip from 'adm-zip';
import fs from 'fs';

export const getRepoDetails = (req, res) => {
    const { githubname, reponame } = req.params;
    const downloadRepositoryFiles = async (githubname, reponame) => {
        try {
            // Make a request to the GitHub API to get the archive link
            const response = await axios.get(`https://api.github.com/repos/${githubname}/${reponame}/zipball`, {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
                responseType: 'stream',
            });

            // Create a write stream to save the downloaded archive
            const writeStream = fs.createWriteStream('repository.zip');

            // Pipe the response stream to the write stream to download the file
            response.data.pipe(writeStream);

            // Wait for the file to finish downloading
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            console.log('Repository files downloaded successfully!');
        } catch (error) {
            console.error('Error downloading repository files:', error.message);
        }
    };
    downloadRepositoryFiles(`${githubname}`, `${reponame}`);

    const extractFilesAndCheckPackageJson = (archiveFilePath) => {
        try {
            // Load the downloaded archive using AdmZip
            const zip = new AdmZip(archiveFilePath);
            // Specify the target directory path
            const targetDirectory = './extracted-files';
            // Extract all files from the archive
            zip.extractAllTo(targetDirectory, /* overwrite */ true);
            // Check if package.json is present in the extracted files
            const packageJsonPath = findPackageJson(/* target directory path */);
            
            if (packageJsonPath) {
                // Read the content of package.json
                const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');

                // Perform your desired action with the package.json content
                console.log(packageJsonContent);
            } else {
                console.log('No package.json found in the extracted files.');
            }
        } catch (error) {
            console.error('Error extracting files and checking package.json:', error.message);
        }
    };

    const findPackageJson = (directoryPath) => {
        // Recursive function to search for package.json in the directory and its subdirectories
        const searchPackageJson = (directory) => {
            const files = fs.readdirSync(directory);
            for (const file of files) {
                const filePath = `${directory}/${file}`;

                // Check if the current file is package.json
                if (file === 'package.json') {
                    return filePath; // Return the path to package.json if found
                }

                // If the current file is a directory, recursively search within it
                if (fs.statSync(filePath).isDirectory()) {
                    const foundPackageJson = searchPackageJson(filePath);
                    if (foundPackageJson) {
                        return foundPackageJson; // Return the path to package.json if found within the subdirectory
                    }
                }
            }
            return null; // Return null if package.json is not found
        };

        return searchPackageJson(directoryPath);
    };
    extractFilesAndCheckPackageJson('repository.zip');


    // Send a response
    res.send(`GitHub Name: ${githubname}, Repo Name: ${reponame}`);
};
