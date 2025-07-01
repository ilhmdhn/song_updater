const { exec } = require('child_process');


const getSharedFolders = (ipAddress) => {
    const command = `net view \\\\${ipAddress}`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(`Failed to execute 'net view': ${error.message}. Stderr: ${stderr}`));
            }
            const lines = stdout.split('\n');
            const shares = [];
            const shareLines = lines.filter(line =>
                line.trim().length > 0 &&
                !line.startsWith('----') &&
                !line.toLowerCase().includes('share name') &&
                !line.toLowerCase().includes('the command completed successfully')
            );

            shareLines.forEach(line => {
                const shareName = line.trim().split(/\s+/)[0];
                if (shareName) {
                    shares.push(shareName);
                }
            });

            resolve(shares);
        });
    });
};

module.exports = getSharedFolders;