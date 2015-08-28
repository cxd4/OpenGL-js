var GL; /* global context name for setting up C emulation in JavaScript */
var dummy_shader_program;

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

    GL_ZERO,
    GL_ONE,
    GL_SRC_COLOR,
    GL_ONE_MINUS_SRC_COLOR,
    GL_SRC_ALPHA,
    GL_ONE_MINUS_SRC_ALPHA,
    GL_DST_ALPHA,
    GL_ONE_MINUS_DST_ALPHA,

    GL_CW,
    GL_CCW,

    GL_FRONT,
    GL_BACK,
    GL_FRONT_AND_BACK,

    GL_VENDOR,
    GL_RENDERER,
    GL_VERSION,
    GL_EXTENSIONS,

    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_STENCIL_BUFFER_BIT;

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
 * blender functions when merging source frame buffer pixels in front of dst.
 * not implemented:  SRC_ALPHA_SATURATE, DST_COLOR and ONE_MINUS_DST_COLOR
 */
    GL_ZERO = context.ZERO;
    GL_ONE = context.ONE;
    GL_SRC_COLOR = context.SRC_COLOR;
    GL_ONE_MINUS_SRC_COLOR = context.ONE_MINUS_SRC_COLOR;
    GL_SRC_ALPHA = context.SRC_ALPHA;
    GL_ONE_MINUS_SRC_ALPHA = context.ONE_MINUS_SRC_ALPHA;
    GL_DST_ALPHA = context.DST_ALPHA;
    GL_ONE_MINUS_DST_ALPHA = context.ONE_MINUS_DST_ALPHA;

    GL_CW = context.CW;
    GL_CCW = context.CCW;

    GL_FRONT = context.FRONT;
    GL_BACK = context.BACK;
    GL_FRONT_AND_BACK = context.FRONT_AND_BACK;

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

var buffer_objects = [];
var dummy_vtx, dummy_frag;
var dummy_ID_pos = 0,
    dummy_ID_col = 1;

var dummy_scripts = [
    "attribute highp vec4 pos;" +
    "attribute lowp vec4 col;" +
    "varying lowp vec4 out_color;" +
    "void main(void) {" +
    "    gl_Position = pos;" +
    "    out_color = col;" +
    "}",

    "varying lowp vec4 out_color;" +
    "void main(void) {" +
    "    gl_FragColor = out_color;" +
    "}",

    "void main(void) {" +
    "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);" +
    "}"
];

function GL_initialize(ML_interface, canvas_name) {
    "use strict";
    var canvas;
    var emulated_vertex_IBO;

/*
 * Rendering OpenGL in a web browser requires the <CANVAS> element, which is
 * currently available as an extension in most browsers (planned for HTML5).
 */
    canvas = ML_interface.getElementById(canvas_name);

    try {
        GL = canvas.getContext("webgl");
        if (!GL) {
            GL = canvas.getContext("experimental-webgl");
         // alert("Warning:  Experimental WebGL implementation.");
        }
    } catch (error) {
    }

    if (!GL) {
        return null;
    }
    emulate_GL_macros(GL);

    dummy_vtx = GL.createShader(GL.VERTEX_SHADER);
    dummy_frag = GL.createShader(GL.FRAGMENT_SHADER);
    dummy_shader_program = GL.createProgram();

    GL.shaderSource(dummy_vtx, dummy_scripts[0]);
    GL.attachShader(dummy_shader_program, dummy_vtx);
    GL.shaderSource(dummy_frag, dummy_scripts[1]);
    GL.attachShader(dummy_shader_program, dummy_frag);

    GL.compileShader(dummy_vtx);
    GL.compileShader(dummy_frag);
    GL.linkProgram(dummy_shader_program);
    GL.useProgram(dummy_shader_program);

    dummy_ID_pos = GL.getAttribLocation(dummy_shader_program, "pos");
    dummy_ID_col = GL.getAttribLocation(dummy_shader_program, "col");

    buffer_objects[GL_VERTEX_ARRAY - GL_VERTEX_ARRAY] = GL.createBuffer();
    buffer_objects[GL_COLOR_ARRAY - GL_VERTEX_ARRAY] = GL.createBuffer();

/*
 * With OpenGL ES, only up to GL_UNSIGNED_SHORT is acceptable for array
 * element indices, which means array[0] .. array[65535].
 *
 * 64 KB of VRAM should be plenty, as it accounts for loading an element
 * array buffer of up to 32768 16-bit unsigned short's.  (Maybe some people
 * will try to load more, though I am not sure that that's a smart idea.)
 */
    emulated_vertex_IBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, emulated_vertex_IBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, 64 * 1024, GL.STATIC_DRAW);

/*
 * Similarly to the above, we can also prevent having to constantly re-
 * allocate the vertex attribute buffers by allocating them only once and
 * keeping all future updates to glBufferSubData, not glBufferData.
 *
 * GL_FLOAT is the largest data type supported on OpenGL ES (GL_DOUBLE with
 * the normal OpenGL specs), so we need to account for 4 bytes times the
 * maximum number of plausible elements one would try to keep updating.
 *
 * I'm supposing that about 256K of VRAM per attribute should be reasonable.
 * This accounts for caching up to 32,768 2-D X,Y vertices of type GL_FLOAT.
 */

    GL.bindBuffer(GL.ARRAY_BUFFER, buffer_objects[2]);
    GL.bufferData(GL.ARRAY_BUFFER, 256 * 1024, GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, buffer_objects[0]);
    GL.bufferData(GL.ARRAY_BUFFER, 256 * 1024, GL.STATIC_DRAW);
    return (GL);
}

function glDrawArrays(mode, first, count) {
    "use strict";

    GL.drawArrays(mode, first, count);
    return;
} /* All versions of OpenGL since 1.1 have this function. */
function glDrawElements(mode, count, type, indices) {
    "use strict";
    var vertex_indices;

    switch (type) {
    case GL_UNSIGNED_BYTE:
        vertex_indices = new Uint8Array(indices);
        break;
    case GL_UNSIGNED_SHORT:
        vertex_indices = new Uint16Array(indices);
        break;
    }
    GL.bufferSubData(GL.ELEMENT_ARRAY_BUFFER, 0, vertex_indices);

    GL.drawElements(mode, count, type, 0);
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

function glBlendFunc(source_factor, destination_factor) {
    "use strict";

    GL.blendFunc(source_factor, destination_factor);
    return;
} /* All versions of OpenGL and OpenGL ES have this function; it's universal. */
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

function glCullFace(mode) {
    "use strict";

    GL.cullFace(mode);
    return;
} /* All versions of OpenGL and OpenGL ES have this function; it's universal. */
function glFrontFace(mode) {
    "use strict";

    GL.frontFace(mode);
    return;
} /* All versions of OpenGL and OpenGL ES have this function; it's universal. */
function glLineWidth(width) {
    "use strict";

/*
 * There were attempts to both deprecate and remove glLineWidth, but it lives
 * on as of yet and is therefore another universal function.
 */
    GL.lineWidth(width);
    return;
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

function glPointSize(size) {
    "use strict";
    var result;

/*
 * Unlike glLineWidth, glPointSize wasn't so lucky in the API's "evolution".
 */
    if (Math.floor(size) === Math.ceil(size)) {
        size += ".0"; /* GLSL error if you pass int types */
    }

    result = dummy_scripts[0].replace("}", "gl_PointSize = " + size + ";}");
    dummy_scripts[0] = result;
    return;
}

function glColor4f(red, green, blue, alpha) {
    "use strict";

/*
 * glColor* is all removed from OpenGL ES 2+.
 * However, glColor4f, in particular, was available on OpenGL ES 1.0.
 */
    dummy_scripts[2] =
            "void main(void) {" +
            "    gl_FragColor = vec4(" +
            red + ", " + green + ", " + blue + ", " + alpha + ");" +
            "}";

    if (GL.getVertexAttrib(dummy_ID_col, GL.VERTEX_ATTRIB_ARRAY_ENABLED)) {
        return;
    } // Do not apply glColor4f if vertex color arrays are already enabled.
    GL.shaderSource(dummy_frag, dummy_scripts[2]);
    GL.compileShader(dummy_frag);
    GL.linkProgram(dummy_shader_program);
    return;
}

/*
 * universal functions since OpenGL 1.1 and available on OpenGL ES 1.x,
 * but revised in the GL3 deprecation to different function names:
 *     * glVertexPointer
 *     * glColorPointer
 *     * glTexCoordPointer
 *     * glNormalPointer
 *     * glEnableClientState
 *     * glDisableClientState
 */
function glEnableClientState(capability) {
    "use strict";
    var index;

    switch (capability) {
    case GL_VERTEX_ARRAY:
        index = dummy_ID_pos;
        break;
    case GL_COLOR_ARRAY:
        index = dummy_ID_col;
        GL.shaderSource(dummy_frag, dummy_scripts[1]);
        GL.compileShader(dummy_frag);
        GL.linkProgram(dummy_shader_program);
        break;
    default:
        index = -1; // Force GL_INVALID_VALUE assertion.
    }
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
        GL.shaderSource(dummy_frag, dummy_scripts[2]);
        GL.compileShader(dummy_frag);
        GL.linkProgram(dummy_shader_program);
        break;
    default:
        index = -1;
    }
    GL.disableVertexAttribArray(index);
    return;
}
function glVertexPointer(size, type, stride, pointer) {
    "use strict";
    var coordinates;

    GL.bindBuffer(GL.ARRAY_BUFFER, buffer_objects[0]);
    GL.bufferSubData(GL.ARRAY_BUFFER, 0, new Float32Array(pointer));
    GL.vertexAttribPointer(dummy_ID_pos, size, type, false, stride, 0);

    switch (size) {
    case 2: // P(x, y, 0, 1)
        coordinates = "pos, 0.0, 1.0";
        break;
    case 3: // P(x, y, z, 1)
        coordinates = "pos, 1.0";
        break;
    case 4: // P(x, y, z, w)
        coordinates = "pos";
        break;
    }
    dummy_scripts[0] =
            "attribute highp vec" + size + " pos;" +
            "attribute lowp vec4 col;" +
            "varying lowp vec4 out_color;" +
            "void main(void) {" +
            "    gl_Position = vec4(" + coordinates + ");" +
            "    out_color = col;" +
            "}";

    GL.shaderSource(dummy_vtx, dummy_scripts[0]);
    GL.compileShader(dummy_vtx);
    GL.linkProgram(dummy_shader_program);
    return;
}
function glColorPointer(size, type, stride, pointer) {
    "use strict";
    var color_RGB_A;

    GL.bindBuffer(GL.ARRAY_BUFFER, buffer_objects[2]);
    GL.bufferSubData(GL.ARRAY_BUFFER, 0, new Float32Array(pointer));
    GL.vertexAttribPointer(dummy_ID_col, size, type, false, stride, 0);

    switch (size) {
    case 3: // r, g, b, 1
        color_RGB_A = "vec4(out_color.rgb, 1.0)";
        break;
    case 4: // r, g, b, inverse-transparency
        color_RGB_A = "out_color";
        break;
    }
    dummy_scripts[1] =
            "varying lowp vec4 out_color;" +
            "void main(void) {" +
            "    gl_FragColor = " + color_RGB_A + ";" +
            "}";

    if (!GL.getVertexAttrib(dummy_ID_col, GL.VERTEX_ATTRIB_ARRAY_ENABLED)) {
        return;
    } // Do not compile the color data in yet, until glEnableClientState.
    GL.shaderSource(dummy_frag, dummy_scripts[1]);
    GL.compileShader(dummy_frag);
    GL.linkProgram(dummy_shader_program);
    return;
}
