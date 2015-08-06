var GL; /* global context name for setting up C emulation in JavaScript */
var dummy_shader_program = 0;

function trace(message) {
    "use strict";

 // alert(message);
    console.log(message);
    return;
}

function trace_GL_error(message, error_code) {
    "use strict";
    var error_message;

    switch (error_code) {
    case GL_NO_ERROR:
        error_message = "GL_NO_ERROR";
        return;
    case GL_INVALID_ENUM:
        error_message = "GL_INVALID_ENUM";
        return;
    case GL_INVALID_VALUE:
        error_message = "GL_INVALID_VALUE";
        return;
    case GL_INVALID_OPERATION:
        error_message = "GL_INVALID_OPERATION";
        return;
    case GL_STACK_OVERFLOW:
        error_message = "GL_STACK_OVERFLOW";
        return;
    case GL_STACK_UNDERFLOW:
        error_message = "GL_STACK_UNDERFLOW";
        return;
    case GL_OUT_OF_MEMORY:
        error_message = "GL_OUT_OF_MEMORY";
        return;
    default:
        error_message = "GL_UNKNOWN_ERROR";
    }
    trace(message + ":  " + error_message);
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
     // trace_error("Warning:  Experimental WebGL implementation.");
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
 * pixel transfer mode enumerations
 * The only 100% universally portable pair is GL_RGBA with GL_UNSIGNED_BYTE.
 */
    GL_RGB = context.RGB;
    GL_ALPHA = context.ALPHA;
    GL_RGBA = context.RGBA;

    GL_UNSIGNED_BYTE = context.UNSIGNED_BYTE;
    GL_UNSIGNED_SHORT_5_6_5 = context.UNSIGNED_SHORT_5_6_5;
    GL_UNSIGNED_SHORT_4_4_4_4 = context.UNSIGNED_SHORT_4_4_4_4;
    GL_UNSIGNED_SHORT_5_5_5_1 = context.UNSIGNED_SHORT_5_5_5_1;

    GL_BYTE = context.BYTE;
    GL_UNSIGNED_SHORT = context.UNSIGNED_SHORT;
    GL_SHORT = context.SHORT;
    GL_UNSIGNED_INT = context.UNSIGNED_INT;
    GL_FLOAT = context.FLOAT;

/*
 * geometric primitives for drawing in vector space
 */
    GL_POINTS = context.POINTS;
    GL_LINE_STRIP = context.LINE_STRIP;
    GL_LINE_LOOP = context.LINE_LOOP;
    GL_LINES = context.LINES;
    GL_TRIANGLE_STRIP = context.TRIANGLE_STRIP;
    GL_TRIANGLE_FAN = context.TRIANGLE_FAN;
    GL_TRIANGLES = context.TRIANGLES;

/*
 * vertex attribute caches...position, color, normalization, and raster
 * Palette-based (color table) rendering is not available on GL ES 1.
 */
    GL_VERTEX_ARRAY = context.VERTEX_ARRAY;
    GL_COLOR_ARRAY = context.COLOR_ARRAY;
    GL_NORMAL_ARRAY = context.NORMAL_ARRAY;
    GL_TEXTURE_COORD_ARRAY = context.TEXTURE_COORD_ARRAY;
 // GL_INDEX_ARRAY = context.INDEX_ARRAY;

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
 // GL_ACCUM_BUFFER_BIT = context.ACCUM_BUFFER_BIT; // not supported in ES
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

    GL_RGB,
    GL_ALPHA,
    GL_RGBA,

    GL_BYTE,
    GL_UNSIGNED_BYTE,
    GL_UNSIGNED_SHORT_5_6_5,
    GL_UNSIGNED_SHORT_4_4_4_4,
    GL_UNSIGNED_SHORT_5_5_5_1,
    GL_SHORT,
    GL_UNSIGNED_SHORT,
    GL_UNSIGNED_INT,
    GL_FLOAT,

    GL_POINTS,
    GL_LINE_STRIP,
    GL_LINE_LOOP,
    GL_LINES,
    GL_TRIANGLE_STRIP,
    GL_TRIANGLE_FAN,
    GL_TRIANGLES,

    GL_VERTEX_ARRAY,
    GL_COLOR_ARRAY,
    GL_NORMAL_ARRAY,
    GL_TEXTURE_COORD_ARRAY,

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
    GL_STENCIL_BUFFER_BIT;

function glDrawArrays(mode, first, count) {
    "use strict";
    var compiled_vertices, compiled_fragments;

    compiled_vertices = GL.getShaderParameter(dummy_vtx, GL.COMPILE_STATUS);
    compiled_fragments = GL.getShaderParameter(dummy_frag, GL.COMPILE_STATUS);
    if (!compiled_vertices) {
        GL.compileShader(dummy_vtx);
    }
    if (!compiled_fragments) {
        GL.compileShader(dummy_frag);
    }

    GL.linkProgram(dummy_shader_program);
    GL.useProgram(dummy_shader_program);
    GL.drawArrays(mode, first, count);
    return;
} /* All versions of OpenGL since 1.1 have this function. */
function glDrawElements(mode, count, type, indices) {
    "use strict";

    GL.drawElements(mode, count, type, indices);
    return;
} /* All versions of OpenGL since 1.1 have this function. */

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

function glScissor(x, y, width, height) {
    "use strict";

    GL.scissor(x, y, width, height);
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

function glReadPixels(x, y, width, height, format, type, data) {
    "use strict";

    GL.readPixels(x, y, width, height, format, type, data.v);
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

/*
 * OpenGL 1.x functions removed by Khronos in OpenGL ES 2+
 *
 * I don't care to support all of them, just some of them.
 *
 * For example, it's impossible to draw a single point, pixel or vertex in
 * OpenGL in a COMPATIBLE way for older systems and the "deprecation" model
 * at the same time, which effectively makes OpenGL a dead language since
 * there is no other alternative to OpenGL which is nearly as cross-platform.
 *
 * Thank Khronos.
 */

var ortho_x1 = -1,
    ortho_x2 = +1,
    ortho_y1 = -1,
    ortho_y2 = +1,
    ortho_z1 = -1,
    ortho_z2 = +1;

var color_red = 1,
    color_green = 1,
    color_blue = 1,
    color_coverage = 1;

function glColor4f(red, green, blue, alpha) {
    "use strict";

/*
 * glColor* is all removed from OpenGL ES 2+.
 * However, glColor4f, in particular, was available on OpenGL ES 1.0.
 */
    color_red = red;
    color_green = green;
    color_blue = blue;

    color_coverage = alpha;

    dummy_scripts[1] =
        "void main(void) {"+
        "    gl_FragColor = vec4(" +
                 color_red + ", " +
                 color_green + ", " +
                 color_blue + ", " +
                 color_coverage +
            ");"+
        "}";
    return;
}

function glRect(x1, y1, x2, y2) {
    "use strict";
    var viewport_state = [], old_color = [], old_scissor = [];
    var scissoring_enabled;
    var raster_x1, raster_y1, raster_x2, raster_y2, delta_x, delta_y;
    var temporary;

/*
 * glRectf, *fv, *d, *dv are deprecated but pretty easy to emulate by using
 * glClear with scissoring to create the rectangle using raster operations.
 */
    scissoring_enabled = glIsEnabled(GL_SCISSOR_TEST);
    if (scissoring_enabled === GL_FALSE) {
        glEnable(GL_SCISSOR_TEST);
    }

    if (x2 < x1) {
        temporary = x2;
        x2 = x1;
        x1 = temporary;
    }
    if (y2 < y1) {
        temporary = y2;
        y2 = y1;
        y1 = temporary;
    }

    viewport_state = GL.getParameter(GL.VIEWPORT);
    old_scissor = GL.getParameter(GL.SCISSOR_BOX);
    old_color = GL.getParameter(GL.COLOR_CLEAR_VALUE);

    raster_x1 = (x1 - ortho_x1)/2 * (viewport_state[2] - 0);
    raster_y1 = (y1 - ortho_y1)/2 * (viewport_state[3] - 0);
    raster_x2 = (x2 + ortho_x2)/2 * (viewport_state[2] - 0);
    raster_y2 = (y2 + ortho_y2)/2 * (viewport_state[3] - 0);

    delta_x = raster_x2 - raster_x1;
    delta_y = raster_y2 - raster_y1;
    glScissor(raster_x1, raster_y1, delta_x, delta_y);

    glClearColor(color_red, color_green, color_blue, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    glScissor(old_scissor[0], old_scissor[1], old_scissor[2], old_scissor[3]);
    glClearColor(old_color[0], old_color[1], old_color[2], old_color[3]);
    if (scissoring_enabled === GL_FALSE) {
        glDisable(GL_SCISSOR_TEST);
    }
    return;
}

/*
 * universal functions since OpenGL 1.1 and available on OpenGL ES 1.x,
 * but revised in the GL3 deprecation to different function names:
 *     * glVertexPointer
 *     * glColorPointer
 *     * glTexCoordPointer
 *     * glNormalPointer
 *     * glIndexPointer
 *     * glEnableClientState
 *     * glDisableClientState
 */
var buffer_objects = [];
var dummy_vtx = 0, dummy_frag = 0;
var dummy_ID_pos = 0,
    dummy_ID_col = 1;

var dummy_scripts = [
   "attribute vec4 pos;"+
   "attribute vec4 col;"+
   "varying lowp vec4 out_color;"+
   "void main(void) {"+
   "    gl_Position = vec4(pos);"+
   "    out_color = vec4(col);"+
   "}",

   "varying lowp vec4 out_color;"+
   "void main(void) {"+
   "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);"+
     // gl_FragColor = vec4(out_color);
   "}"
];
function glEnableClientState(capability) {
    "use strict";
    var index;

 // if (GL.isProgram(dummy_shader_program)) { // JavaScript bug in FireFox??
    if (dummy_shader_program > 0) {
        GL.deleteProgram(dummy_shader_program);
    }
    dummy_shader_program = GL.createProgram();

    if (dummy_vtx === 0) {
        dummy_vtx = GL.createShader(GL.VERTEX_SHADER);
    }
    GL.shaderSource(dummy_vtx, dummy_scripts[0]);
    GL.attachShader(dummy_shader_program, dummy_vtx);

    if (dummy_frag === 0) {
        dummy_frag = GL.createShader(GL.FRAGMENT_SHADER);
    }
    GL.shaderSource(dummy_frag, dummy_scripts[1]);
    GL.attachShader(dummy_shader_program, dummy_frag);

    GL.compileShader(dummy_vtx);
    GL.compileShader(dummy_frag);

    GL.linkProgram(dummy_shader_program);
    GL.useProgram(dummy_shader_program);

    switch (capability) {
    case GL_VERTEX_ARRAY:
        dummy_ID_pos = GL.getAttribLocation(dummy_shader_program, "pos");
        index = dummy_ID_pos;
        break;
    case GL_COLOR_ARRAY:
        dummy_ID_col = GL.getAttribLocation(dummy_shader_program, "col");
        index = dummy_ID_col;
        break;
    case GL_NORMAL_ARRAY:
        index = 2;
        break;
    case GL_TEXTURE_COORD_ARRAY:
        index = 3;
        break;
    default:
        trace_error(GL_INVALID_VALUE);
        return;
    }
    buffer_objects[index] = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, buffer_objects[index]);
    GL.enableVertexAttribArray(index);
    return;
}
function glDisableClientState(capability) {
    "use strict";
    var index;

    switch (capability) {
    case GL_VERTEX_ARRAY:
        index = dummy_ID_pos;
        break;
    case GL_COLOR_ARRAY:
        index = dummy_ID_col;
        break;
    case GL_NORMAL_ARRAY:
        index = 2;
        break;
    case GL_TEXTURE_COORD_ARRAY:
        index = 3;
        break;
    default:
        trace_error(GL_INVALID_VALUE);
        return;
    }
    GL.disableVertexAttribArray(index);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.deleteBuffer(buffer_objects[index]);

    if (dummy_vtx != 0) {
        GL.detachShader(dummy_shader_program, dummy_vtx);
        GL.deleteShader(dummy_vtx);
        dummy_vtx = 0;
    }
    if (dummy_frag != 0) {
        GL.detachShader(dummy_shader_program, dummy_frag);
        GL.deleteShader(dummy_frag);
        dummy_frag = 0;
    }
    return;
}
function glVertexPointer(size, type, stride, pointer) {
    "use strict";
    var vector_size;
    var coordinates;

    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pointer), GL.STREAM_DRAW);
    GL.vertexAttribPointer(dummy_ID_pos, size, type, GL_FALSE, stride, 0);

    switch (size) {
    case 2: // P(x, y, 0, 1)
        vector_size = "vec2";
        coordinates = "pos, 0, 1";
        break;
    case 3: // P(x, y, z, 1)
        vector_size = "vec3";
        coordinates = "pos, 1";
        break;
    case 4: // P(x, y, z, w)
        vector_size = "vec4";
        coordinates = "pos";
        break;
    }
    dummy_scripts[0] =
        "attribute " + vector_size + " pos;"+
        "attribute " + "vec4" + " col;"+
        "varying lowp " + "vec4" + " out_color;"+
        "void main(void) {"+
        "    gl_Position = vec4(" + coordinates + ");"+
        "    out_color = vec4(col);"+
        "}";
    return;
}
function glColorPointer(size, type, stride, pointer) {
    "use strict";
    var vector_size;
    var color_RGB_A;

    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pointer), GL.STREAM_DRAW);
    GL.vertexAttribPointer(dummy_ID_col, size, type, GL_FALSE, stride, 0);

    switch (size) {
    case 3: // r, g, b, 1
        vector_size = "vec3";
        color_RGB_A = "out_color, 1";
        break;
    case 4: // r, g, b, a
        vector_size = "vec4";
        color_RGB_A = "out_color";
        break;
    }
    dummy_scripts[1] =
        "varying lowp " + vector_size + " out_color;"+
        "void main(void) {"+
        "    gl_FragColor = vec4(" + color_RGB_A + ");"+
        "}";
    return;
}

function glDrawPixels(width, height, format, type, data) {
/*
 * Against all favorable odds for performance and quality, glDrawPixels is
 * somewhat desirable to have.  However, there are way, way too many factors
 * involved for me to make a function to emulate it as a deprecated function.
 *
 * For starters, it depends on what was set with glPixelStore, glPixelMap,
 * glPixelTransfer, glPixelZoom and glRasterPos*, which are all deprecated
 * functions as well and have a ton of possible inputs to care for.
 *
 * Ideally, glDrawPixels **COULD** be emulated by using glClear w/ glScissor
 * on a pixel-by-pixel basis.  Such a design would be painfully slow, but
 * then again so is the original deprecated function anyway.
 */
    switch (format) {
 // case GL_RGBA:
    default:
        trace(GL_INVALID_OPERATION); /* not implemented (yet?), sorry */
    }
    return;
}

function glCopyPixels(x, y, width, height, type) {
    var frame_buffer = [];
    var format;

/*
 * In theory, a call to glCopyPixels is a more direct version of doing a call
 * first to glReadPixels and then glDrawPixels, but I have not tested this.
 */
    switch (type) {
    case GL.DEPTH:
        format = GL.DEPTH_COMPONENT;
        break;
    case GL.STENCIL:
        format = GL.STENCIL_INDEX;
        break;
    default:
        format = GL.RGBA;
    }
    glReadPixels(x, y, width, height, format, type, frame_buffer);
    glDrawPixels(width, height, format, type, frame_buffer);
    return;
}
