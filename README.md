# A collection of pattern generators

Old private project of mine from early 2019.

Open [the web app](https://sebastiansimon.github.io/pattern-generators) and click <kbd>Add new pattern generator</kbd>, then type in the file names found in the [generators directory](/generators). You can then choose these generators in the <kbd>Choose a pattern …</kbd> menu.

I don’t really remember why I designed it in such a way that you have to add these generators by typing them manually. I have to revisit this later.

There is a [template](/template.mjs) for generators. Look at the code of the other generators to create a new one. The `title` field in the exported object is the tooltip of the option.

The [`fixValues` module](/lib/fixValues.mjs) could probably be simplified a lot; this is probably from before I knew about `valueAsNumber`.

## Examples

### `compositionNotebook.mjs`

![A pattern that looks like the cover of a composition notebook.](https://user-images.githubusercontent.com/37915283/187811481-747b4094-e9cf-4d1d-8eea-863e8cbdfdee.png)

### `dirtyWater.mjs`

![Something that looks like water made dirty by randomly drawn lines.](https://user-images.githubusercontent.com/37915283/187811418-c1a3e046-2993-41f0-96dd-ea3000525509.png)

### `mcEscherMosaic.mjs`

![A pattern based on mosaic pictures by M. C. Escher. I can see a head with horns here, akin the one of a demon.](https://user-images.githubusercontent.com/37915283/187811325-9f0f8a4c-bcca-4ce7-aea7-d787c8780ba4.png)

### `modularMultiplication.mjs`

![A pattern based on modular multiplication.](https://user-images.githubusercontent.com/37915283/187811285-7cb0ee23-bd45-46b8-bcd9-296ac19e4db3.png)

### `radialSierpinski.mjs`

![A pattern resembling the Sierpinski triangle, but radial.](https://user-images.githubusercontent.com/37915283/187811186-2acbb556-11e4-4a54-9276-36e9260e7df0.png)

### `rotationalSymmetry.mjs`

![Randoml colorful tiny triangles, arranged in a rotationally symmetric way. These are reminiscent of identicons. 4 samples are shown.](https://user-images.githubusercontent.com/37915283/187811043-24e100fc-f34a-4312-bb57-047d9093fcca.png)

### `uuid.mjs`

Using `c49ae43a-69d8-4ebc-b138-095fbb793d8a`, `e4ff17f2-090b-46b4-996f-1fa20fbba6ea`, `43faf3b7-4c53-4e32-885d-c71440414de1`, and `88b40878-2b56-48a6-8f0b-8e674231acf8`.

![Five pentagons and hexadecimal digits in the middle based on a UUID, which is easy to visually distinguish. 4 samples are shown.](https://user-images.githubusercontent.com/37915283/187810985-ae02af12-e09c-407f-a882-5b644f6f6d59.png)

### `weirdSpikyChessboard.mjs`

![Something that looks like a chessboard-based fractal](https://user-images.githubusercontent.com/37915283/187811131-f57d0893-0959-4853-9bab-ba47fa7948d3.png)
