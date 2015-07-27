var GL; /* global context name for setting up C emulation in JavaScript */

/*
 * Here is where the OpenGL application is all done, from a C perspective.
 *
 * In C:  #include <GL/gl.h>
 * Then the rest of this file after the below function can be ignored.
 */
function main_GL() {
    "use strict";

    glClearColor(0, 1, 1, 0.5);
    glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
    glClear(GL_COLOR_BUFFER_BIT);

    glFlush();
    glFinish();
    return;
}

function GL_initialize(ML_interface, trace_error) {
    "use strict";
    var canvas;

/*
 * Rendering OpenGL in a web browser requires the <CANVAS> element, which is
 * currently available as an extension in most browsers (planned for HTML5).
 */
    canvas = ML_interface.getElementById("GL_canvas");
    GL = canvas.getContext("webgl");

    if (!GL) {
        GL = canvas.getContext("experimental-webgl");
        if (!GL) {
            trace_error("Unable to initialize WebGL.");
            return;
        }
        trace_error("Warning:  Experimental WebGL implementation.");
    }
    emulate_GL_macros(GL);
    main_GL();
    return;
}

function emulate_GL_macros(context) {
    "use strict";

    GL_COLOR_BUFFER_BIT = context.COLOR_BUFFER_BIT;
    GL_DEPTH_BUFFER_BIT = context.DEPTH_BUFFER_BIT;
    GL_ACCUM_BUFFER_BIT = context.ACCUM_BUFFER_BIT;
    GL_STENCIL_BUFFER_BIT = context.STENCIL_BUFFER_BIT;

    GL_FALSE = 0;
    GL_TRUE = 1;
    return;
}

var GL_FALSE,
    GL_TRUE,

    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_ACCUM_BUFFER_BIT,
    GL_STENCIL_BUFFER_BIT;

function glClear(buffers_mask) {
    "use strict";

    GL.clear(buffers_mask);
    return;
} /* All versions of OpenGL and OpenGL ES have this function; it's universal. */

function glClearColor(red, green, blue, alpha) {
    "use strict";

    GL.clearColor(red, green, blue, alpha);
    return;
} /* All versions of OpenGL and OpenGL ES have this function; it's universal. */

function glColorMask(R, G, B, A) {
    "use strict";

    GL.colorMask(R, G, B, A);
    return;
} /* All versions of OpenGL and OpenGL ES have this function; it's universal. */

function glFlush() {
    "use strict";

    GL.flush();
    return;
} /* All versions of OpenGL and OpenGL ES have this function; it's universal. */

function glFinish() {
    "use strict";

    GL.finish();
    return;
} /* All versions of OpenGL and OpenGL ES have this function; it's universal. */
