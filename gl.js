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
        break;
    case GL_INVALID_ENUM:
        error_message = "GL_INVALID_ENUM";
        break;
    case GL_INVALID_VALUE:
        error_message = "GL_INVALID_VALUE";
        break;
    case GL_INVALID_OPERATION:
        error_message = "GL_INVALID_OPERATION";
        break;
    case GL_INVALID_FRAMEBUFFER_OPERATION:
        error_message = "GL_INVALID_FRAMEBUFFER_OPERATION";
        break;
    case GL_OUT_OF_MEMORY:
        error_message = "GL_OUT_OF_MEMORY";
        break;
    default:
        error_message = "GL_UNKNOWN_ERROR";
    }
    trace(message + ":  " + error_message);
    return;
}

function GL_initialize(ML_interface, canvas_name) {
    "use strict";
    var canvas;

/*
 * Rendering OpenGL in a web browser requires the <CANVAS> element, which is
 * currently available as an extension in most browsers (planned for HTML5).
 */
    canvas = ML_interface.getElementById(canvas_name);
    GL = canvas.getContext("webgl");

    if (!GL) {
        GL = canvas.getContext("experimental-webgl");
        if (!GL) {
            return null;
        }
     // trace_error("Warning:  Experimental WebGL implementation.");
    }
    emulate_GL_macros(GL);
    return (GL);
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
 // GL_STACK_OVERFLOW = context.STACK_OVERFLOW; // not possible with OpenGL ES
 // GL_STACK_UNDERFLOW = context.STACK_UNDERFLOW; // not possible with OpenGL ES
    GL_INVALID_FRAMEBUFFER_OPERATION = context.INVALID_FRAMEBUFFER_OPERATION;
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
 *
 * These are the OpenGL ES 1.x definitions for the macros, as they were
 * removed afterwards in order to force everyone to equip GLSL shaders.
 */
    GL_VERTEX_ARRAY = 0x8074;
    GL_COLOR_ARRAY = 0x8076;
    GL_NORMAL_ARRAY = 0x8075;
    GL_TEXTURE_COORD_ARRAY = 0x8078;

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
    GL_EXTENSIONS = 0x1F03; // universal to OpenGL and GL ES but not to WebGL

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
    GL_INVALID_FRAMEBUFFER_OPERATION,
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

    GL.drawArrays(mode, first, count);
    return;
} /* All versions of OpenGL since 1.1 have this function. */
function glDrawElements(mode, count, type, indices) {
    "use strict";
    var vertex_indices;
    var vertex_index_buffer_object;

    vertex_index_buffer_object = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vertex_index_buffer_object);
    switch (type) {
    case GL_UNSIGNED_BYTE:
        vertex_indices = new Uint8Array(indices);
        break;
    case GL_UNSIGNED_SHORT:
        vertex_indices = new Uint16Array(indices);
        break;
    }

    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, vertex_indices, GL.STATIC_DRAW);
    GL.drawElements(mode, count, type, vertex_indices);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    GL.deleteBuffer(vertex_index_buffer_object);
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

function glColor4f(red, green, blue, alpha) {
    "use strict";

/*
 * glColor* is all removed from OpenGL ES 2+.
 * However, glColor4f, in particular, was available on OpenGL ES 1.0.
 */
    dummy_scripts[1] =
            "void main(void) {" +
            "    gl_FragColor = vec4(" +
            red + ", " + green + ", " + blue + ", " + alpha + ");" +
            "}";
    return;
}

function glRectf(x1, y1, x2, y2) {
    "use strict";
    var rectangle = [];
    var temporary;
    var x = 0, y = 1, coordinates_per_vertex = 2;

/*
 * Optional (but my preference):
 * Force a rearrangement of the specified coordinates to ensure that (x1, y1)
 * is the lower-left point of the rectangle and (x2, y2) the upper-right.
 *
 * This is achievable by swapping x2 with x1, if (x2 < x1) and also y2 with
 * y1, if (y2 < y1).
 */
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

    rectangle[0 * coordinates_per_vertex + x] = x1;
    rectangle[0 * coordinates_per_vertex + y] = y1; // lower-left

    rectangle[1 * coordinates_per_vertex + x] = x2;
    rectangle[1 * coordinates_per_vertex + y] = y1; // lower-right

    rectangle[2 * coordinates_per_vertex + x] = x1;
    rectangle[2 * coordinates_per_vertex + y] = y2; // upper-left

    rectangle[3 * coordinates_per_vertex + x] = x2;
    rectangle[3 * coordinates_per_vertex + y] = y2; // upper-right

    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(coordinates_per_vertex, GL_FLOAT, 0, rectangle);
    glDrawArrays(GL_TRIANGLE_STRIP, 0, 3 + 1);
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
    "varying highp vec4 out_color;" +
            "attribute highp vec4 pos;" +
            "attribute highp vec4 col;" +
            "void main(void) {" +
            "    gl_Position = vec4(pos);" +
            "    out_color = vec4(col);" +
            "}",

    "varying highp vec4 out_color;" +
            "void main(void) {" +
            "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);" +
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
    default:
        index = capability - GL_VERTEX_ARRAY;
        return;
    }
    GL.enableVertexAttribArray(index);
    buffer_objects[index] = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, buffer_objects[index]);
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
    default:
        index = capability - GL_VERTEX_ARRAY;
        return;
    }
    GL.disableVertexAttribArray(index);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.deleteBuffer(buffer_objects[index]);

    if (dummy_vtx !== 0) {
        GL.detachShader(dummy_shader_program, dummy_vtx);
        GL.deleteShader(dummy_vtx);
        dummy_vtx = 0;
    }
    if (dummy_frag !== 0) {
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

    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pointer), GL.STATIC_DRAW);
    GL.vertexAttribPointer(dummy_ID_pos, size, type, GL_FALSE, stride, 0);

    switch (size) {
    case 2: // P(x, y, 0, 1)
        vector_size = "vec2";
        coordinates = "pos, 0.0, 1.0";
        break;
    case 3: // P(x, y, z, 1)
        vector_size = "vec3";
        coordinates = "pos, 1.0";
        break;
    case 4: // P(x, y, z, w)
        vector_size = "vec4";
        coordinates = "pos";
        break;
    }
    dummy_scripts[0] =
            "attribute highp " + vector_size + " pos;" +
            "attribute highp " + "vec4" + " col;" +
            "varying highp " + "vec4" + " out_color;" +
            "void main(void) {" +
            "    gl_Position = vec4(" + coordinates + ");" +
            "    out_color = vec4(col);" +
            "}";
    return;
}
function glColorPointer(size, type, stride, pointer) {
    "use strict";
    var color_RGB_A;

    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pointer), GL.STATIC_DRAW);
    GL.vertexAttribPointer(dummy_ID_col, size, type, GL_FALSE, stride, 0);

    switch (size) {
    case 3: // r, g, b, 1
        color_RGB_A = "1.0";
        break;
    case 4: // r, g, b, a
        color_RGB_A = "out_color.a";
        break;
    }
    dummy_scripts[1] =
            "varying highp vec4 out_color;" +
            "void main(void) {" +
            "    gl_FragColor = vec4(out_color.rgb, " + color_RGB_A + ");" +
            "}";
    return;
}
