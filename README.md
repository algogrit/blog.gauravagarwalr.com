# Technical blog

Built using [Phenomic](https://github.com/MoOx/phenomic) and using `phenomic-theme-base`.

## Local Setup

### Install dependencies

```sh
npm install
```

### Run development server

```sh
npm start
```

### Build for production

```sh
npm run build
```

## Publishing to medium

Uses [medium-cli][medium-cli], to publish.

### Install

```bash
npm install -g medium-cli
```

See [repo][medium-cli] for setup instructions.

### Publish

```bash
cd medium
medium publish
```

This adds `published: true` to the front matter of the published articles to avoid duplication.

[medium-cli]: https://github.com/lambtron/medium-cli
