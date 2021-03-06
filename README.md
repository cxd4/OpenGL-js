# OpenGL-js
Experimental interface for C-style OpenGL functions for faster cross-testing in JavaScript WebGL.

It's a lazy name for a wrapper interface that exposes most of the fundamentally important C functions any OpenGL programmer should expect.  The wrapper functions--as with the native API being emulated--still have to be coded through JavaScript, as there is no other way to establish an interface for OpenGL programming inside the web browser.

`gl.js` is the source code, and `gl.min.js` is the compiled JavaScript script. They are both interchangeable; it doesn't matter which one you reference in your pages for your OpenGL code as far as functionality goes.  The major difference is file size and readability of the code, so the compressed and harder-to-read `gl.min.js` may load or even perform slightly faster on other computers or Internet connections.

Thanks to the [Babel](https://babeljs.io/) JavaScript compiler for doing such a great job at compressing my `gl.js` programming into such a compact `gl.min.js`--the latter of which during the compression was processed in such a way that the multi-line GLSL shader scripts were translated into traditional, pre-ES6 multi-line strings which should work better with older browsers (like Internet Explorer 11 instead of Microsoft Edge) that still support WebGL canvases.  Other than this, there should be no compatibility difference between `gl.js` and `gl-min.js`, so use whichever you think is more appropriate for your project.

### Exposed GL Commands
The exposed API resembles a minimalist subset of OpenGL ES 1.0--the very first version of OpenGL by Khronos (for embedded systems)--which predates the official decision to deprecate most of the functions important to computer-aided design and fundamental outside of the game design industry.

In general, all of the _"universal"_ OpenGL commands are exposed as C-style functions through this wrapper, which means anything valid in all four of these basic OpenGL variations:
* OpenGL 1.0 (original API after the proprietary IRIS GL by Silicon Graphics, Inc.)
* OpenGL ES 1.0 (Khronos-modified API for mobile devices:  partial deprecation)
* OpenGL 3.1+ (modified API:  full deprecation but more powerful than ES)
* OpenGL ES 2.0+ (Khronos-modified API:  full deprecation plus weak graphics chipset features only)

### Currently Unimplemented Commands
While most of the universal functions and features are supported, there are a few I have not gotten to:
* glHint
* glGetBooleanv, glGetIntegerv and glGetFloatv
* glClearStencil, glStencilMask and glDepthMask
* glStencilFunc, glStencilOp, and glDepthFunc
* glTexImage2D, gl(Get)TexParameter(f/i)(v), glPixelStorei and any pixel upload operation

It is not possible to do pixel transfers yet with this wrapper alone, except to do frame buffer reads using `glReadPixels` which is, fortunately, one of the universal OpenGL commands and has been implemented here.

### Currently Implemented Non-_"Universal"_ Commands
Drawing even a single point to the screen is impossible without breaking either backwards compatibility with OpenGL (ES) 1.x or forwards compatibility with the deprecation-compliant OpenGL 3.x or ES 2+.  The only workaround seems to be using `glClear` with `glScissor` to draw a single pixel to the screen by clearing it, but this is not a very smart way to use OpenGL (despite the apparent portability of such horrible drawing algorithm).  Therefore, the following deprecated functions are also exposed through this wrapper for portability, coding simplicity, and convenience:
* glEnableClientState (available in GL (ES) 1.1, runs on top of WebGL `enableVertexAttribArray`)
* glDisableClientState (available in GL (ES) 1.1, runs on top of WebGL `disableVertexAttribArray`)
* glVertexPointer (available in GL (ES) 1.1, runs on top of WebGL `vertexAttribPointer`)
* glColorPointer (available in GL (ES) 1.1, also runs on top of WebGL `vertexAttribPointer`)
* glColor4f (available in OpenGL (ES) 1.0, runs on top of simple GLSL fragment shader)
* glPointSize (available in OpenGL (ES) 1.0, runs on top of glUniform1f vertex shader uploads)

There is no support for `glTexCoordPointer` (or any connected pixel upload operation) due to the amount of complication this adds to the underlying GLSL shaders used to support the exposure of these high-level functions.  There is also no support for `glIndexPointer` because color-indexed rendering mode is not universal to all versions of OpenGL (ES), nor is it significant to simple computer-aided design applications like RGBA rendering is.  Finally, `glNormalPointer` is unimplemented because normalization is not a familiar concept to the author of this wrapper and due to the fact that such complications to GLSL fragment shading would perhaps be left best to the modern OpenGL programmer who is fine with the deprecation model.

The typical geometric transformation functions--`glRotate*`, `glScale*`, and `glTranslate*`--are also deprecated but not implemented in this wrapper due to the immense complication of reading back positional data written to 3-D space and then manipulating them.  It is expected instead that you should be familiar with vertex arrays in OpenGL and recycle the vertex coordinate arrays by manipulating them yourself with trigonometric functions from the standard library.  (For example, instead of `glRotate*`, compute the inverse sine and inverse cosine of the y and x coordinates, respectively, then accumulate an angular offset to said coordinates, then update the values in the client-side vertex array with the new sines and cosines.)

### Minimum System Requirements

* HTML4 web browser, with support for the `CANVAS` extension drafted in HTML5
* JavaScript client-side scripting enabled, with at least partial ECMAScript 6 support (ES2015)
* recent video card which has not been [blacklisted as unsupported](https://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists)

The first two requirements are known to be met for WebGL under the following browsers:

* Microsoft Edge (**not** Internet Explorer 11, unless using `gl.min.js` instead of `gl.js`)
* **newer** Chromium-based release versions (including Iron and Google Chrome 42+)
* most web browsers from under the Mozilla family (including SeaMonkey and FireFox 35+)

### Coding Examples

The interface provided here can be used as something of a transition between truly fixed-function, deprecated OpenGL programming and immediate-mode, modern OpenGL programming.  Any beginner to OpenGL would probably have the highest chance of being able to understand and maintain this method of drawing a square:
```c
glBegin(GL_QUADS); /* GL_POLYGON also works here. */
glVertex2d(-0.5, -0.5);
glVertex2d(+0.5, -0.5);
glVertex2d(+0.5, +0.5);
glVertex2d(-0.5, +0.5);
glEnd();
```
The first step to making this code more forward-compatible is to start out by considering the use of C arrays to cache the vertex positions into a more "manageable" work source:
```c
GLdouble square[2 * 4];

square[0*2 + 0] = -0.5; square[0*2 + 1] = -0.5;
square[1*2 + 0] = +0.5; square[1*2 + 1] = -0.5;
square[2*2 + 0] = +0.5; square[2*2 + 1] = +0.5;
square[3*2 + 0] = -0.5; square[3*2 + 1] = +0.5;

glBegin(GL_QUADS);
glVertex2dv(&square[0 * 2]);
glVertex2dv(&square[1 * 2]);
glVertex2dv(&square[2 * 2]);
glVertex2dv(&square[3 * 2]);
glEnd();
```
The next step is to use the vertex array itself as the whole input to GL:
```c
GLdouble square[COORDINATES_PER_VERTEX * 4] = {
    /* same as above ... */
};

glEnableClientState(GL_VERTEX_ARRAY); /* activates vertex pointer reads */
glVertexPointer(COORDINATES_PER_VERTEX, GL_DOUBLE, 0, square);
/*
 * Note:  The above two functions need not be called in that order.
 * The two lines can be switched and have the same effect.
 */

glDrawArrays(GL_QUADS, 0, 4);
```
The final significant step is to adjust your drawing code to not assume native support for drawing quadrilaterals directly.  While `GL_QUADS` may be fastest on some implementations or exotic video hardware, the basic principle is that the vast majority of video drivers end up emulating this by converting it to `GL_TRIANGLES` or `GL_TRIANGLE_STRIP` mid-way, as triangles are the basic mathematical unit in all trigonometry.  Perhaps unfairly, the option was deprecated along with `GL_POLYGON` and removed from the OpenGL ES and WebGL specifications (with no actual gain in the end result), but it does seem fair to assume that triangle code is more portable and less arbitrary than quadrilateral code.

The first simple workaround to `GL_QUADS` being deleted is to draw a "strip" of two triangles:
```c
GLdouble square[COORDINATES_PER_VERTEX * 4] = {
    -0.5, -0.5,
    +0.5, -0.5,
    -0.5, +0.5,
    +0.5, +0.5
};

glEnableClientState(GL_VERTEX_ARRAY);
glVertexPointer(COORDINATES_PER_VERTEX, GL_DOUBLE, 0, square);

glDrawArrays(GL_TRIANGLE_STRIP, 0, 4); /* Triangle "fans" work, too. */
```

A second, more forceful workaround is to draw the square using `GL_TRIANGLES`, but this will require sending 6 vertices to the vertex array instead of only 4.  Changing the allocation of the `square[]` array to re-define two vertices over could be avoided by using `glDrawElements` instead of `glDrawArrays`:
```c
GLdouble square[COORDINATES_PER_VERTEX * 4] = {
    /* old values from initial example with glBegin(GL_QUADS) */
};
GLubyte indices[] = {
    0, /* &square[0 * COORDINATES_PER_VERTEX] */
    1, /* &square[1 * COORDINATES_PER_VERTEX] */
    3, /* &square[3 * COORDINATES_PER_VERTEX] */

    1, /* &square[1 * COORDINATES_PER_VERTEX] */
    3, /* &square[3 * COORDINATES_PER_VERTEX] */
    2, /* &square[2 * COORDINATES_PER_VERTEX] */
};

glEnableClientState(GL_VERTEX_ARRAY);
glVertexPointer(COORDINATES_PER_VERTEX, GL_DOUBLE, 0, square);

glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_BYTE, indices);
```

A third and final workaround which is of the most fundamental importance:  Do not be distracted by deprecation.  To this day, it impacts nothing realistically except for WebGL or OpenGL ES.  You and you alone are able to determine rightfully whether low-level rendering performance is less or more of a priority with the type(s) of OpenGL application(s) you do, over other priorities which such optimizations (some of which a lot less certain than others, if even optimizations at all in some cases) may vary against.
