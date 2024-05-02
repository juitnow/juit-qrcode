Juit GmbH's Own _QR Code Generator_
===================================

> First of all, kudos are due to [Alexey Ten](https://github.com/alexeyten)
> who wrote the _original_ [`qr-image`](https://www.npmjs.com/package/qr-image)
> package. Without his incredible work this project would not exist.

This package simply generate QR codes, using _modern_ web standards like
[`CompressionStream`](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream)s,
`Promise`s (with `async`/`await`) and has zero dependencies on NodeJS or other
frameworks (therefore making it suitable for inclusion in runtimes like
[Cloudflare Workers](https://workers.cloudflare.com/)).

* [Main API](#main-api)
  * [Arguments](#arguments)
  * [Options](#options)
* [Bundler-friendly API](#bundler-friendly-api)
* [Low-level API](#low-level-api)
  * [The `QRCode` object](#the-qrcode-object)
  * [SVG paths](#svg-paths) (and [PDFKit](https://pdfkit.org/) integration)
* [Copyright Notice](NOTICE.md)
* [License](LICENSE.md)

# Main API

To generate a QR code simply use the `generate(...)` async function:

```typescript
import { generate } from `@juit/qrcode`

const image = await generate('https://www.juit.com/', 'png')
// `image` here is a Uint8Array containing the PDF data
```

#### Arguments

* `message`: a `string` or `Uint8Array` containing the data to be included in
             the generated QR code
* `format`: the format of the QR code to generate, that is:
  * `png`: a PNG image (as a `Uint8Array`)
  * `pdf`: a PDF document (as a `Uint8Array` - uses compression)
  * `svg`: a SVG image (as a `string`)
  * `pngData`: the _data URL_ (as a `string`) of a PNG image
  * `pdfData`: the _data URL_ (as a `string`) of a PDF document
  * `svgData`: the _data URL_ (as a `string`) of a SVG image
* `options`: an optional object containing encoding options

#### Options

* `ecLevel`: the error correction level for the QR code
             (default: `M`)
  * `L`: approximately 7% of error correction capability
  * `M`: approximately 15% of error correction capability
  * `Q`: approximately 25% of error correction capability
  * `H`: approximately 30% of error correction capability
* `url`: whether to optimize URLs in QR codes or not
         (default: `false`)
* `scale`: the number of pixels used for each dot in the matrix
           (default: `1` for PNG/SVG and `9` for PDF)
* `margin`: the size of the margin around the QR code in matrix modules
            (default: `4` as per the QR code specification - the _quiet area_)



# Bundler-friendly API

If final bundle sizes are important for you, we also offer individual APIs for
each format we generate. The bundler's own _tree shaking_ algorithm should be
able to then remove all irrelevant code.

The main functions are:

* `generatePngQrCode(message, options?)`: \
  asynchronously generates a QR code in PNG format (as a `Promise<Uint8Array>`)
* `generatePdfQrCode(message, options?)`: \
  asynchronously generates a QR code in PDF format (as a `Promise<Uint8Array>`)
* `generateSvgQrCode(message, options?)`: \
  synchronously generates a QR code in SVG format (as a `string`)

To generate data URLs on the other hand:

* `generatePngDataQrCode(message, options?)`: \
  asynchronously generates a QR code as a data URL in PNG format (as a `Promise<string>`)
* `generatePdfDataQrCode(message, options?)`: \
  asynchronously generates a QR code as a data URL in PDF format (as a `Promise<string>`)
* `generateSvgDataQrCode(message, options?)`: \
  synchronously generates a QR code as a data URL in PDF format (as a `string`)

The message and options consumed by these functions are the same ones described
in the [main api](#main-api).



# Low-level API

The low-level API splits the _generation_ of a QR code from its rendering as
an image.

* `generateQrCode(message, options?)`: \
  generates a `QRCode` object from the given message
* `generatePng(qrcode, options?)`: \
  asynchronously renders a previously generated `QRCode` as a PNG image
  (as a `Promise<Uint8Array>`)
* `generatePdf(qrcode, options?)`: \
  asynchronously renders a previously generated `QRCode` as a PDF document
  (as a `Promise<Uint8Array>`)
* `generateSvg(qrcode, options?)`: \
  synchronously renders a previously generated `QRCode` as a SVG image
  (as a `string`)

You can combine those APIs to (for example) generate a single QR code for
a message, and then render it in multiple formats.

The message and options consumed by these functions are the same ones described
in the [main api](#main-api).

#### The `QRCode` object

The object returned by `generateQrCode(...)` contains the following properties:

* `version`: the version of the QR code (1...40)
* `ecLevel`: the error correction level for the QR code (`L`, `M`, `Q` or `H`)
* `size`: The size (in pixels, or QR code blokcs) of the QR code
* `matrix`: The QR code matrix (where `true` is black, `false` is white)

#### SVG paths

The `generateSvgPath(qrcode)` function generate a SVG _path_ for a QR code.

The returned SVG path will be a simple conversion of the QR code's own
_`matrix`_ into a square path of _**N**_ "pixels" (where _**N**_ is the size of
the QR code's _`size`_ of the matrix).

This can be scaled and positioned into a final SVG using the `scale(...)` and
`translate(...)` [basic SVG transformations](https://developer.mozilla.org/en-US/docs/Web/G/Tutorial/Basic_Transformations).

This is also particulary useful with [PDFKit](https://pdfkit.org/)'s own
implementation of [SVG paths](https://pdfkit.org/docs/vector.html#svg_paths).

We can use it together with `translate(...)` and `scale(...)` to draw our QR
code anywhere on the page, in any size. For example, to prepare a simple A4
document with a 10cm QR code smack in the middle we can:

```typescript
// generate the QR code _structure_ for our message
const code = generateQrCode('https://www.juit.com/')

// generate the SVG path for our QR code
const path = generateSvgPath(code)

// calculate how to translate and scale our QR code in the page
const dpcm = 72 / 2.54             // PDFKit uses 72dpi (inches) we want metric!
const size = 10 * dpcm             // 10 cm (size of our QR code) in dots
const scale = size / code.size     // scale factor for our QR code to be 10 cm
const x = ((21 - 10) / 2) * dpcm   // center horizontally
const y = ((29.7 - 10) / 2) * dpcm // center vertically

// create a new A4 document, and stream it to "test.pdf"
const document = new PDFDocument({ size: 'A4' })
const stream = createWriteStream('test.pdf')
document.pipe(stream)

// draw our 10cm QR code right in the middle of the page
document
  .translate(x, y) // move to x = 5.5cm, y = 9.85cm
  .scale(scale)    // scale our QR code to 10cm width and height
  .path(path)      // draw our QR code smack in the middle of the page
  .fill('black')   // fill our QR code in black
  .end()           // finish up and close the document

// wait for the stream to finish
stream.on('finish', () => {
  // your PDF file is ready!
})
```
