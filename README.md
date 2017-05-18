# docker-tools
Docker tools used by shimo

## Install

```bash
npm install shimo-docker-tools -g
```

## Usage

### export & import
This is used to import many images on a offline machine, you can import many images with their repo and tag information.

#### step 1: export

command: `dtools export test.json`

on: your own computer

for: export servaral images to a folder with a meta.json which is including image repo and tag informations.

The test.json like this:
```javascript
[
  {
    repo: 'xxx',
    tag: 'xxx'
  }
]
```

#### step 2: import

command: `dtools import targetDir`

on: the offline computer

for: Import images with repo and tag infomation from a folder created by `dtools export` above.

### image

#### remove

This is used to remove servaral images with wildcard:

```bash
dtools image remove prefix*
```

## License
MIT