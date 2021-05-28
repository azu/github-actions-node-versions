# github-actions-node-versions

Update `node-version` in GitHub Actions to LTS and active Node.js versions

## Examples

`npx github-actions-node-versions` update following workflow

```yaml
name: "CI"
on: [ push, pull_request ]

jobs:
  test:
    strategy:
      matrix:
        os: [ ubuntu-latest, windows-latest ]
        node-version: [ 10, 12, 14 ]
    name: Test(Node ${{ matrix.node }} on ${{ matrix.os }})
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }} # install node.js
      - name: Install
        run: npm install
      - name: Test
        run: npm test
```

to 

```yaml
name: "CI"
on: [ push, pull_request ]

jobs:
  test:
    strategy:
      matrix:
        os: [ ubuntu-latest, windows-latest ]
        node-version: [ 12, 14, 16 ]
    name: Test(Node ${{ matrix.node-version }} on ${{ matrix.os }})
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }} # install node.js
      - name: Install
        run: npm install
      - name: Test
        run: npm test
```

- use `[Maintenance LTS, Active LTS, Current]` 3 versions by default
    - [nodejs/Release: Node.js Release Working Group](https://github.com/nodejs/Release)
- preserved comment

## Install

Install with [npm](https://www.npmjs.com/):

    npm install github-actions-node-versions

## Usage

    Usage
      $ github-actions-node-versions
 
    Options
        --githubDir     path to .github dir (default: {cwd}/.github)
 
    Examples
      $ github-actions-node-versions

## Changelog

See [Releases page](https://github.com/azu/github-actions-node-versions/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/github-actions-node-versions/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- azu: [GitHub](https://github.com/azu), [Twitter](https://twitter.com/azu_re)

## License

MIT © azu
