# OpenGL-js
Experimental interface for C-style OpenGL functions for faster cross-testing in JavaScript WebGL.

It's a lazy name for a wrapper interface that exposes most of the fundamentally important C functions any OpenGL programmer should expect.  The wrapper functions--as with the native API being emulated--still have to be coded through JavaScript, as there is no other way to establish an interface for OpenGL programming inside the web browser.

### Exposed GL Commands
The exposed API resembles a minimalist subset of OpenGL ES 1.0--the very first version of OpenGL by Khronos (for embedded systems)--which predates the official decision to deprecate most of the functions important to computer-aided design and fundamental outside of the game design industry.

In general, all of the _"universal"_ OpenGL commands are exposed as C-style functions through this wrapper, which means anything valid in all four of these basic OpenGL variations:
* OpenGL 1.0 (original API after the proprietary IRIS GL by Silicon Graphics, Inc.)
* OpenGL ES 1.0 (Khronos-modified API for mobile devices:  partial deprecation)
* OpenGL 3.1+ (modified API:  full deprecation but more powerful than ES)
* OpenGL ES 2.0+ (Khronos-modified API:  full deprecation plus weak graphics chipset features only)

### Currently Unimplemented Commands
While most of the universal functions and features are supported, there are a few I have not gotten to:
* glCullFace and glFrontFace
* glHint
* glLineWidth
* glClearStencil, glStencilMask and glDepthMask
* glBlendFunc, glStencilFunc, glStencilOp, and glDepthFunc
* glTexImage2D, gl(Get)TexParameter(f/i)(v), glPixelStorei and any pixel upload operation

It is not possible to do pixel transfers yet with this wrapper alone, except to do frame buffer reads using `glReadPixels` which is, fortunately, one of the universal OpenGL commands and has been implemented here.

### Currently Implemented Non-_"Universal"_ Commands
Drawing even a single point to the screen is impossible without breaking either backwards compatibility with OpenGL (ES) 1.x or forwards compatibility with the deprecation-compliant OpenGL 3.x or ES 2+.  The only workaround seems to be using `glClear` with `glScissor` to draw a single pixel to the screen by clearing it, but this is not a very smart way to use OpenGL (despite the apparent portability of such horrible drawing algorithm).  Therefore, the following deprecated functions are also exposed through this wrapper for portability, coding simplicity, and convenience:
* glEnableClientState (available in GL (ES) 1.1, runs on top of WebGL `enableVertexAttribArray`)
* glDisableClientState (available in GL (ES) 1.1, runs on top of WebGL `disableVertexAttribArray`)
* glVertexPointer (available in GL (ES) 1.1, runs on top of WebGL `vertexAttribPointer`)
* glColorPointer (available in GL (ES) 1.1, also runs on top of WebGL `vertexAttribPointer`)
* glRectf (available in OpenGL 1.0 but unavailable in OpenGL ES and deprecated)
* glColor4f (available in OpenGL (ES) 1.0, runs on top of simple GLSL fragment shader)

There is no support for `glTexCoordPointer` (or any connected pixel upload operation) due to the amount of complication this adds to the underlying GLSL shaders used to support the exposure of these high-level functions.  There is also no support for `glIndexPointer` because color-indexed rendering mode is not universal to all versions of OpenGL (ES), nor is it significant to simple computer-aided design applications like RGBA rendering is.  Finally, `glNormalPointer` is unimplemented because normalization is not a familiar concept to the author of this wrapper and due to the fact that such complications to GLSL fragment shading would perhaps be left best to the modern OpenGL programmer who is fine with the deprecation model.

The typical geometric transformation functions--`glRotate*`, `glScale*`, and `glTranslate*`--are also deprecated but not implemented in this wrapper due to the immense complication of reading back positional data written to 3-D space and then manipulating them.  It is expected instead that you should be familiar with vertex arrays in OpenGL and recycle the vertex coordinate arrays by manipulating them yourself with trigonometric functions from the standard library.  (For example, instead of `glRotate*`, compute the inverse sine and inverse cosine of the y and x coordinates, respectively, then accumulate an angular offset to said coordinates, then update the values in the client-side vertex array with the new sines and cosines.)

### System Requirements
The system requirements for writing and running OpenGL code on the web using this wrapper are the same exactly as those for the native WebGL API it wraps around.  OpenGL ES hardware should, in general, have way fewer expectations than desktop OpenGL hardware, but this is not so from the perspective of reality, in which deprecation has crept its way into the ranks of modern OpenGL standards, while making hardware requirements more complex.  Therefore, even though this API exposes mostly OpenGL ES 1.0 functions (plus some deprecated functions) for convenience, all of the underlying browser's OpenGL ES 2.0 hardware requirements for WebGL remain.
