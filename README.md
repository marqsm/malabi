# Malabi
### General
Malabi is a small utility library, made just for fun and learning, basically to see if I could.

Motivation was to try making similar tools as in underscore.js, lo-dash etc JS libraries, adding some more functional features like partial functions (missing in underscore, but do exist in lo-dash), currying (missing in both) and so on.

**It is completely unoptimized and untested in any real environment, and absolutely nobody should currently use it in production.**

What it is good for is understanding what functions like map, filter, reduce do (from underscore) and simple functional concepts like composing functions and creating partial functions. Currying functions is under construction.

### Installing
1. Clone the repository
2. Install [bower] (see the site for more instructions)
3. run `bower install`
4. Fire up your local HTTP-server of choice

### Testing
The index.html is just some basic tests for the functions. Test coverage varies greatly, but shows to some extent what the functions do.

### Documentation
Currently just the tests. Naming is in most parts same as in underscore, and the functions should do similar things.

### Inspiration and straight-up imitation

`PartialLeft` & `PartialRight` and a lot of ideas and inspiration from Reginald Braithwaites excellent eBook "[JavaScript Allongé]" - currently my favourite JavaScript-book.

[bower]:http://bower.io
[JavaScript Allongé]:https://leanpub.com/javascript-allonge/