# A collection of pattern generators

Old private project of mine from early 2019.

Open [the web app](https://sebastiansimon.github.io/pattern-generators) and click <kbd>Add new pattern generator</kbd>, then type in the file names found in the [generators directory](/generators). You can then choose these generators in the <kbd>Choose a pattern …</kbd> menu.

I don’t really remember why I designed it in such a way that you have to add these generators by typing them manually. I have to revisit this later.

There is a [template](/template.mjs) for generators. Look at the code of the other generators to create a new one. The `title` field in the exported object is the tooltip of the option.

The [`fixValues` module](/lib/fixValues.mjs) could probably be simplified a lot; this is probably from before I knew about `valueAsNumber`.
