module.exports = (functionName, error) =>{
    console.error(`
        Error ${functionName}
        Error: ${error},
        Message: ${error.message},
        stack: ${error.stack},
    `);
}