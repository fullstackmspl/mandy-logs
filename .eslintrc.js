module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        eqeqeq:"off",
        curly:"error",
        quotes:["error","single","double"],
        semi:[2,"always"]
    }
}
