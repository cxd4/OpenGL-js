# OpenGL-js
Experimental interface for C-style OpenGL functions for faster cross-testing in JavaScript WebGL.

Besides exposing the old C-style function names (e.g. `glClear()` instead of constantly writing `webgl.clear()`, the other primary purpose of this project is to also ease basic, minimalist creations for developers who are not doing complex graphics programming for efficiency purposes (Think the deprecation model after OpenGL 3.) but for quick results with less code using some fixed-function calls.  In the interest of forward-compatibility with OpenGL ES 1.x, we prefer to have a wrapper callback for client-side vertex arrays, rather than implement immediate-mode vertex-drawing calls involving _glBegin()_ or _glEnd()_.

NO LONGER MAINTAINED ON GITHUB; DEV MOVED TO GITLAB
https://gitlab.com/cxd4/OpenGL-js
