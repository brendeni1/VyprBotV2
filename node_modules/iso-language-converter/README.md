# iso-language-converter [![Build Status][travis-image]][travis-url]

Converter between different ISO 639 language tags.

The list of codes is taken by [Wikipedia](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes), while the default scripts for each language is taken from [this table](https://docs.google.com/spreadsheets/d/1M1yv9aBUmc-NyCJX69vOLUmH2uIglSwmDwgRgByI1AI).

## Install

```sh
npm install --save iso-language-converter
```

## Usage

```js
var isoConv = require('iso-language-converter');

isoConv('ita'); // Italian
isoConv('it'); // Italian
isoConv('Italian'); // it

isoConv('it', {from: 1, to: 'label'}); // Italian
isoConv('ita', {from: 2, to: 1}); // it

isoConv('it', {from: 'label'}); // Italian
isoConv('ita', {from: 1}); // it

isoConv('it', {to: 'script'}); // 'Latn'
isoConv('ho', {to: 'script'}); // undefined
```

## API

### isoConv(input, [options])

#### input

Type: `string`

The code of the language in one of the ISO 639 form _-or-_ the English name for the language.

#### options

Type: `object`

Options for the converter:

```js
{
  // number of ISO 639 from 1 to 5, or 'label'
  // if not specified, guess on the input
  from: 1,

  // number of ISO 639 from 1 to 5, 'label' or 'script'
  // if not specified, guess on the input
  to: 'label',

  // return an ISO 639-5 if the requested ISO is not present (not valid with to:'label')
  // default: false
  fallback: false
}
```

## License

MIT

[travis-url]: https://travis-ci.org/pasqLisena/iso-language-converter
[travis-image]: https://travis-ci.org/pasqLisena/iso-language-converter.svg?branch=master
