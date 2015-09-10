var GL; /* global context name for setting up C emulation in JavaScript */
var GL_state = {};

/*
 * GL constants known to the C pre-processor.
 *
 * Instead of saying WebGLContext.BLEND or GL.BLEND all the time, we should
 * be able to say GL_BLEND as we can already do in the C language binding.
 *
 * Carefully triple-checked and taken from the JavaScript console debugger,
 * the OpenGL ES 1.1 specifications and the online OpenGL specifications.
 * Derived by setting GL_$name = WebGLContext.$name in the debugger.
 */
var
    GL_FALSE = false, // C macro is 0, but strict JS equality needs false.
    GL_TRUE = true, // C macro is 1, but strict JS equality needs true.
    // Example:  (glIsEnabled(GL_BLEND) == 1) passes, but (... === 1) fails.

 // glGetError(void)
    GL_NO_ERROR = 0,
    GL_INVALID_ENUM = 0x0500,
    GL_INVALID_VALUE = 0x0501,
    GL_INVALID_OPERATION = 0x0502,
 // GL_STACK_OVERFLOW = 0x0503, // WebGL.STACK_OVERFLOW is undefined.
 // GL_STACK_UNDERFLOW = 0x0504, // WebGL.STACK_UNDERFLOW is undefined.
    GL_OUT_OF_MEMORY = 0x0505,
    GL_INVALID_FRAMEBUFFER_OPERATION = 0x0506, // not universal
    GL_CONTEXT_LOST = undefined, // not universal

 // glReadPixels()
    GL_ALPHA = 0x1906,
    GL_RGB = 0x1907,
    GL_RGBA = 0x1908,

    GL_BYTE = 0x1400,
    GL_UNSIGNED_BYTE = 0x1401,
    GL_SHORT = 0x1402,
    GL_UNSIGNED_SHORT = 0x1403,
    GL_FLOAT = 0x1406,
    GL_UNSIGNED_SHORT_5_6_5 = 33635,
    GL_UNSIGNED_SHORT_4_4_4_4 = 32819,
    GL_UNSIGNED_SHORT_5_5_5_1 = 32820,

 // rendering primitives
    GL_POINTS = 0,
    GL_LINES = 1,
    GL_LINE_LOOP = 2,
    GL_LINE_STRIP = 3,
    GL_TRIANGLES = 4,
    GL_TRIANGLE_STRIP = 5,
    GL_TRIANGLE_FAN = 6,

 // client-side vertex array states (emulated--unavailable in WebGL)
    GL_VERTEX_ARRAY = 0x8074, // emulated
    GL_NORMAL_ARRAY = 0x8075,
    GL_COLOR_ARRAY = 0x8076, // emulated
    GL_TEXTURE_COORD_ARRAY = 0x8078,

 // glIsEnabled(), glEnable() and glDisable()
    GL_CULL_FACE = 2884,
    GL_BLEND = 3042,
    GL_DITHER = 3024,
    GL_STENCIL_TEST = 2960,
    GL_DEPTH_TEST = 2929,
    GL_SCISSOR_TEST = 3089,
    GL_POLYGON_OFFSET_FILL = 0x8037,
    GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E,
    GL_SAMPLE_COVERAGE = 0x80A0,

 // glBlendFunc()
    GL_ZERO = 0,
    GL_ONE = 1,
    GL_SRC_COLOR = 0x0300,
    GL_ONE_MINUS_SRC_COLOR = 0x0301,
    GL_SRC_ALPHA = 0x0302,
    GL_ONE_MINUS_SRC_ALPHA = 0x0303,
    GL_DST_ALPHA = 0x0304,
    GL_ONE_MINUS_DST_ALPHA = 0x0305,

 // glFrontFace()
    GL_CW = 0x0900,
    GL_CCW = 0x0901,

 // glCullFace()
    GL_FRONT = 0x404,
    GL_BACK = 0x405,
    GL_FRONT_AND_BACK = 0x408,

 // glGetString(GLenum) -- return values
    GL_VENDOR = 0x1F00,
    GL_RENDERER = 0x1F01,
    GL_VERSION = 0x1F02,
    GL_EXTENSIONS = 0x1F03,

 // glClear(GLbitfield) -- bit masks
    GL_DEPTH_BUFFER_BIT = 0x00000100,
 // GL_ACCUM_BUFFER_BIT = 0x00000200, // WebGL.ACCUM_BUFFER_BIT is undefined.
    GL_STENCIL_BUFFER_BIT = 0x00000400,
    GL_COLOR_BUFFER_BIT = 0x00004000;

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
    var location;

/*
 * Like its cousin, glLineWidth, glPointSize went back and forth between
 * deprecation.  Ultimately, in WebGL, it must be emulated as a GLSL uniform.
 */
    location = GL.getUniformLocation(
        GL_state.programs[GL_state.p][GL_state.qx],
        "point_size"
    );

    GL.uniform1f(location, size);
    return;
}

function glColor4f(red, green, blue, alpha) {
    "use strict";
    var IDs = [];
    var color_vector = [red, green, blue, alpha];
    var i = 0;

/*
 * glColor* is all removed from OpenGL ES 2+.
 * However, glColor4f, in particular, was available on OpenGL ES 1.0.
 */
    IDs[0] = GL.getUniformLocation(GL_state.programs[0][0], "const_color");
    IDs[1] = GL.getUniformLocation(GL_state.programs[1][0], "const_color");
    IDs[2] = GL.getUniformLocation(GL_state.programs[2][0], "const_color");

    while (i < 3) {
        GL.useProgram(GL_state.programs[i][0]);
        GL.uniform4fv(IDs[i], color_vector);
        i += 1;
    }

    GL.useProgram(GL_state.programs[GL_state.p][GL_state.qx]); // restored
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
        index = 0;
        break;
    case GL_COLOR_ARRAY:
        index = 1;
        GL_state.qx = GL_state.q;
        GL.useProgram(GL_state.programs[GL_state.p][GL_state.q]);
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
        index = 0;
        break;
    case GL_COLOR_ARRAY:
        index = 1;
        GL_state.qx = 0;
        GL.useProgram(GL_state.programs[GL_state.p][GL_state.qx]);
        break;
    default:
        index = -1;
    }
    GL.disableVertexAttribArray(index);
    return;
}
function glVertexPointer(size, type, stride, pointer) {
    "use strict";

    GL.bindBuffer(GL.ARRAY_BUFFER, GL_state.buffer_objects[0]);
    GL.bufferSubData(GL.ARRAY_BUFFER, 0, new Float32Array(pointer));
    GL.vertexAttribPointer(0, size, type, false, stride, 0);

    switch (size) {
    case 2: // P(x, y, 0, 1)
        GL_state.p = 2;
        break;
    case 3: // P(x, y, z, 1)
        GL_state.p = 1;
        break;
    case 4: // P(x, y, z, w)
        GL_state.p = 0;
        break;
    }
    GL.useProgram(GL_state.programs[GL_state.p][GL_state.qx]);
    return;
}
function glColorPointer(size, type, stride, pointer) {
    "use strict";

    GL.bindBuffer(GL.ARRAY_BUFFER, GL_state.buffer_objects[2]);
    GL.bufferSubData(GL.ARRAY_BUFFER, 0, new Float32Array(pointer));
    GL.vertexAttribPointer(1, size, type, false, stride, 0);

    switch (size) {
    case 3: // r, g, b, 1
        GL_state.q = 2;
        break;
    case 4: // r, g, b, inverse-transparency
        GL_state.q = 1;
        break;
    }
    if (GL_state.qx !== 0) { // Color arrays NOT disabled for using glColor4f?
        GL_state.qx = GL_state.q;
    }
    GL.useProgram(GL_state.programs[GL_state.p][GL_state.qx]);
    return;
}

function GL_get_context(ML_interface, canvas_name) {
    "use strict";
    var canvas;
    var emulated_vertex_IBO;

 // Prevent re-assigning the context if it already was set with a valid context.
    if (GL) {
        if (GL.isContextLost() === GL_FALSE) {
            return (GL);
        }
    }

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
        ML_interface.write("WebGL getContext() exception.<BR>" + error);
    }

    if (!GL) {
        return null;
    }
    GL_CONTEXT_LOST = GL.CONTEXT_LOST_WEBGL;

/*
 * Here comes the ugly part....
 */
    var vs = "attribute highp ";
    var v = "\tgl_Position = vec4(";
    var cs = "varying lowp ";
    var c = "\tgl_FragColor = ";

    var ps = "uniform float point_size;\n";
    var gl_PS = "\tgl_PointSize = point_size;\n";

    var entry = "void main(void) {\n";
    var esc = "}\n";

    var cs_uni = "uniform lowp vec4 const_color;\n";
    var csw = "\toutc = col;\n";
    var ca = "attribute lowp ";
    var s = [null, ca + "vec4 col;\n", ca + "vec3 col;\n"];

    var col = [cs_uni, cs + "vec4 outc;\n", cs + "vec3 outc;\n"];
    var glCol = [c + "const_color;\n", c + "outc;\n", c + "vec4(outc, 1.0);\n"];

    var pos = [vs + "vec4 pos;\n", vs + "vec3 pos;\n", vs + "vec2 pos;\n"];
    var glPos = [v + "pos);\n", v + "pos, 1.0);\n", v + "pos, 0.0, 1.0);\n"];

    var GLSL_scripts = [
        [ // 4-dimensional positions with constant color
            pos[0] + ps + entry + glPos[0] + gl_PS + esc,
            col[0] + entry + glCol[0] + esc
        ],
        [ // 4-dimensional positions with 4-channel color
            pos[0] + ps + col[1] + s[1] + entry + glPos[0] + gl_PS + csw + esc,
            col[1] + entry + glCol[1] + esc
        ],
        [ // 4-dimensional positions with 3-channel color
            pos[0] + ps + col[2] + s[2] + entry + glPos[0] + gl_PS + csw + esc,
            col[2] + entry + glCol[2] + esc
        ],
        [ // 3-dimensional positions with constant color
            pos[1] + ps + entry + glPos[1] + gl_PS + esc,
            col[0] + entry + glCol[0] + esc
        ],
        [ // 3-dimensional positions with 4-channel color
            pos[1] + ps + col[1] + s[1] + entry + glPos[1] + gl_PS + csw + esc,
            col[1] + entry + glCol[1] + esc
        ],
        [ // 3-dimensional positions with 3-channel color
            pos[1] + ps + col[2] + s[2] + entry + glPos[1] + gl_PS + csw + esc,
            col[2] + entry + glCol[2] + esc
        ],
        [ // 2-dimensional positions with constant color
            pos[2] + ps + entry + glPos[2] + gl_PS + esc,
            col[0] + entry + glCol[0] + esc
        ],
        [ // 2-dimensional positions with 4-channel color
            pos[2] + ps + col[1] + s[1] + entry + glPos[2] + gl_PS + csw + esc,
            col[1] + entry + glCol[1] + esc
        ],
        [ // 2-dimensional positions with 3-channel color
            pos[2] + ps + col[2] + s[2] + entry + glPos[2] + gl_PS + csw + esc,
            col[2] + entry + glCol[2] + esc
        ]
    ];
    GL_state.programs = [];
    GL_state.programs[0] = [];
    GL_state.programs[1] = [];
    GL_state.programs[2] = [];

    var temp_vertex_shader, temp_fragment_shader;
    var p, q, i = 0;
    while (i < 3 * 3) {
        q = i % 3;
        p = (i - q) / 3;
        GL_state.programs[p][q] = GL.createProgram();
        temp_vertex_shader = GL.createShader(GL.VERTEX_SHADER);
        temp_fragment_shader = GL.createShader(GL.FRAGMENT_SHADER);

        GL.shaderSource(temp_vertex_shader, GLSL_scripts[i][0]);
        GL.attachShader(GL_state.programs[p][q], temp_vertex_shader);
        GL.shaderSource(temp_fragment_shader, GLSL_scripts[i][1]);
        GL.attachShader(GL_state.programs[p][q], temp_fragment_shader);

        GL.compileShader(temp_vertex_shader);
        GL.compileShader(temp_fragment_shader);
        GL.bindAttribLocation(GL_state.programs[p][q], 0, "pos");
        GL.bindAttribLocation(GL_state.programs[p][q], 1, "col");

        GL.linkProgram(GL_state.programs[p][q]);
        GL.deleteShader(temp_vertex_shader);
        GL.deleteShader(temp_fragment_shader);
        i += 1;
    }

    GL_state.buffer_objects = [];
    GL_state.buffer_objects[0] = GL.createBuffer();
    GL_state.buffer_objects[2] = GL.createBuffer();

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
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, 64 * 1024, GL.DYNAMIC_DRAW);

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

    GL.bindBuffer(GL.ARRAY_BUFFER, GL_state.buffer_objects[2]);
    GL.bufferData(GL.ARRAY_BUFFER, 256 * 1024, GL.DYNAMIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, GL_state.buffer_objects[0]);
    GL.bufferData(GL.ARRAY_BUFFER, 256 * 1024, GL.DYNAMIC_DRAW);

/*
 * Preserve and track the current vertex program ID, as a 2-D array of names.
 */
    GL_state.p = 0;
    GL_state.q = 0;
    GL.useProgram(GL_state.programs[GL_state.p][GL_state.q]);
    GL_state.qx = 0; // color backup state hack

/*
 * Finally, we need to emulate the initial GL state machine settings.
 *
 * For example, the default OpenGL color is white:  glColor4i(1, 1, 1, 1);
 * Another example:  Point sizes during GL_POINTS raster art, glPointSize(1);
 *
 * Because shader-based "modern" OpenGL needs to emulate these using GLSL and
 * uniform attributes, we need to initialize the uniforms in this wrapper.
 */
    glColor4f(1.0, 1.0, 1.0, 1.0);
    glPointSize(1.0);

    return (GL);
}
