var GL; /* global context name for setting up C emulation in JavaScript */

function trace(message) {
    "use strict";

 // alert(message);
    console.log(message);
    return;
}

/*
 * Here is where the OpenGL application is all done, from a C perspective.
 *
 * In C:  #include <GL/gl.h>
 * Then the rest of this file after the below function can be ignored.
 */
function main_GL() {
    "use strict";
    var viewport_state = {v: []};
    var error_code;

    glClearColor(0, 1, 1, 0.5);
    glColorMask(GL_FALSE, GL_TRUE, GL_FALSE, GL_TRUE);
    glClear(GL_COLOR_BUFFER_BIT);

    glFlush();
    glFinish();

    glGetIntegerv(GL.VIEWPORT, viewport_state);
    glViewport(0, 0, viewport_state[2], viewport_state[3]);

    trace(glGetString(GL_VENDOR));
    trace(glGetString(GL_RENDERER));
    trace(glGetString(GL_VERSION));
    trace(glGetString(GL_EXTENSIONS));

    error_code = glGetError();
    if (error_code !== GL_NO_ERROR) {
        trace_error(error_code);
    }
    return;
}

function trace_error(error_code) {
    "use strict";

    switch (error_code) {
    case GL_NO_ERROR:
        trace("GL_NO_ERROR");
        return;
    case GL_INVALID_ENUM:
        trace("GL_INVALID_ENUM");
        return;
    case GL_INVALID_VALUE:
        trace("GL_INVALID_VALUE");
        return;
    case GL_INVALID_OPERATION:
        trace("GL_INVALID_OPERATION");
        return;
    case GL_STACK_OVERFLOW:
        trace("GL_STACK_OVERFLOW");
        return;
    case GL_STACK_UNDERFLOW:
        trace("GL_STACK_UNDERFLOW");
        return;
    case GL_OUT_OF_MEMORY:
        trace("GL_OUT_OF_MEMORY");
        return;
    default:
        trace("GL_UNKNOWN_ERROR");
    }
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

/*
 * known enumerations for OpenGL error codes
 */
    GL_NO_ERROR = context.NO_ERROR;
    GL_INVALID_ENUM = context.INVALID_ENUM;
    GL_INVALID_VALUE = context.INVALID_VALUE;
    GL_INVALID_OPERATION = context.INVALID_OPERATION;
    GL_STACK_OVERFLOW = context.STACK_OVERFLOW;
    GL_STACK_UNDERFLOW = context.STACK_UNDERFLOW;
    GL_OUT_OF_MEMORY = context.OUT_OF_MEMORY;

/*
 * capability enumerations for glIsEnabled, glEnable and glDisable
 *
 * These were all taken from the OpenGL ES 2.0 reference, but a couple of
 * them I am sure are not universal to all OpenGL versions.
 */
    GL_BLEND = context.BLEND;
    GL_CULL_FACE = context.CULL_FACE;
    GL_DEPTH_TEST = context.DEPTH_TEST;
    GL_DITHER = context.DITHER;
    GL_POLYGON_OFFSET_FILL = context.POLYGON_OFFSET_FILL;
    GL_SAMPLE_ALPHA_TO_COVERAGE = context.SAMPLE_ALPHA_TO_COVERAGE;
    GL_SAMPLE_COVERAGE = context.SAMPLE_COVERAGE;
    GL_SCISSOR_TEST = context.SCISSOR_TEST;
    GL_STENCIL_TEST = context.STENCIL_TEST;

/*
 * universally accepted queries for glGetString(macro)
 */
    GL_VENDOR = context.VENDOR;
    GL_RENDERER = context.RENDERER;
    GL_VERSION = context.VERSION;
    GL_EXTENSIONS = context.EXTENSIONS;

/*
 * bit masks for wiping with glClear
 */
    GL_COLOR_BUFFER_BIT = context.COLOR_BUFFER_BIT;
    GL_DEPTH_BUFFER_BIT = context.DEPTH_BUFFER_BIT;
    GL_ACCUM_BUFFER_BIT = context.ACCUM_BUFFER_BIT;
    GL_STENCIL_BUFFER_BIT = context.STENCIL_BUFFER_BIT;

    GL_FALSE = false;
    GL_TRUE = true;
    return;
}

var GL_FALSE,
    GL_TRUE,

    GL_NO_ERROR,
    GL_INVALID_ENUM,
    GL_INVALID_VALUE,
    GL_INVALID_OPERATION,
    GL_STACK_OVERFLOW,
    GL_STACK_UNDERFLOW,
    GL_OUT_OF_MEMORY,

    GL_BLEND,
    GL_CULL_FACE,
    GL_DEPTH_TEST,
    GL_DITHER,
    GL_POLYGON_OFFSET_FILL,
    GL_SAMPLE_ALPHA_TO_COVERAGE,
    GL_SAMPLE_COVERAGE,
    GL_SCISSOR_TEST,
    GL_STENCIL_TEST,

    GL_VENDOR,
    GL_RENDERER,
    GL_VERSION,
    GL_EXTENSIONS,

    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_ACCUM_BUFFER_BIT,
    GL_STENCIL_BUFFER_BIT;

function glDisable(capability) {
    "use strict";

    GL.disable(capability);
    return;
}
function glEnable(capability) {
    "use strict";

    GL.enable(capability);
    return;
}
function glIsEnabled(capability) {
    "use strict";
    return GL.isEnabled(capability);
}

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

function glGetError() {
    "use strict";
    return GL.getError();
} /* All versions of OpenGL and OpenGL ES have this function; it's universal. */

function glViewport(x, y, width, height) {
    "use strict";

    GL.viewport(x, y, width, height);
    return;
} /* All versions of OpenGL and OpenGL ES have this function; it's universal. */

/*
 * These functions are all universal to all versions of OpenGL.
 *
 * However, type agnosticism in JavaScript, as a language, makes the
 * differing function names obsolete.  In WebGL, they are all renamed to:
 *     params = getParameter(name);
 */
function glGetBooleanv(name, params) {
    "use strict";

    params.v = GL.getParameter(name);
    return;
}
function glGetIntegerv(name, params) {
    "use strict";

    params.v = GL.getParameter(name);
    return;
}
function glGetFloatv(name, params) {
    "use strict";

    params.v = GL.getParameter(name);
    return;
}
function glGetString(name) {
    "use strict";

/*
 * Deprecation never happened in OpenGL, and neither did Khronos.
 *
 * Moving glGetString(GL_EXTENSIONS) to glGetStringi was pretty much the
 * exact opposite direction of their claimed intention to stream OpenGL into
 * a low-level, performance-only API.  Their excuse was some potential
 * security risk with extraneously duplicating the string to a new buffer.
 *
 * The deprecation model encourages:  instead of better code practice, worse.
 */
    if (name === GL_EXTENSIONS) {
        var ext = [];
        var ext_list = "";
        var i = 0;

        ext = GL.getSupportedExtensions(); // C:  glGetStringi(GL_EXTENSIONS)
        while (i < ext.length) {
            if (ext_list.length) {
                ext_list += "\n";
            }
            ext_list += ext[i];
            i += 1;
        }
        return (ext_list);
    }
    return GL.getParameter(name);
}
