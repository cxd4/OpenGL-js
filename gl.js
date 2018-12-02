/*
 * @licstart	The following is the entire license notice for the
 * JavaScript code in this file.
 *
 * OpenGL JS:  C-style OpenGL (ES) wrapper defined using JavaScript WebGL.
 * Copyright (C) 2015-2018 rjs
 *
 * This program is free software:  you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * @licend	The above is the entire license notice for the JavaScript
 * code in this file.
 */

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
var GL_FALSE = false; // C macro is 0, but strict JS equality needs false.
var GL_TRUE = true; // C macro is 1, but strict JS equality needs true.
    // Example:  (glIsEnabled(GL_BLEND) == 1) passes, but (... === 1) fails.

 // glGetError(void)
var GL_NO_ERROR = 0;
var GL_INVALID_ENUM = 0x0500;
var GL_INVALID_VALUE = 0x0501;
var GL_INVALID_OPERATION = 0x0502;
 // GL_STACK_OVERFLOW = 0x0503; // WebGL.STACK_OVERFLOW is undefined.
 // GL_STACK_UNDERFLOW = 0x0504; // WebGL.STACK_UNDERFLOW is undefined.
var GL_OUT_OF_MEMORY = 0x0505;
var GL_INVALID_FRAMEBUFFER_OPERATION = 0x0506; // not universal
var GL_CONTEXT_LOST = undefined; // not universal

 // glReadPixels()
var GL_ALPHA = 0x1906;
var GL_RGB = 0x1907;
var GL_RGBA = 0x1908;

var GL_BYTE = 0x1400;
var GL_UNSIGNED_BYTE = 0x1401;
var GL_SHORT = 0x1402;
var GL_UNSIGNED_SHORT = 0x1403;
var GL_FLOAT = 0x1406;
var GL_UNSIGNED_SHORT_5_6_5 = 33635;
var GL_UNSIGNED_SHORT_4_4_4_4 = 32819;
var GL_UNSIGNED_SHORT_5_5_5_1 = 32820;

 // rendering primitives
var GL_POINTS = 0;
var GL_LINES = 1;
var GL_LINE_LOOP = 2;
var GL_LINE_STRIP = 3;
var GL_TRIANGLES = 4;
var GL_TRIANGLE_STRIP = 5;
var GL_TRIANGLE_FAN = 6;

 // client-side vertex array states (emulated--unavailable in WebGL)
var GL_VERTEX_ARRAY = 0x8074; // emulated
var GL_NORMAL_ARRAY = 0x8075;
var GL_COLOR_ARRAY = 0x8076; // emulated
var GL_TEXTURE_COORD_ARRAY = 0x8078;

 // glIsEnabled(), glEnable() and glDisable()
var GL_CULL_FACE = 2884;
var GL_BLEND = 3042;
var GL_DITHER = 3024;
var GL_STENCIL_TEST = 2960;
var GL_DEPTH_TEST = 2929;
var GL_SCISSOR_TEST = 3089;
var GL_POLYGON_OFFSET_FILL = 0x8037;
var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
var GL_SAMPLE_COVERAGE = 0x80A0;

 // glBlendFunc()
var GL_ZERO = 0;
var GL_ONE = 1;
var GL_SRC_COLOR = 0x0300;
var GL_ONE_MINUS_SRC_COLOR = 0x0301;
var GL_SRC_ALPHA = 0x0302;
var GL_ONE_MINUS_SRC_ALPHA = 0x0303;
var GL_DST_ALPHA = 0x0304;
var GL_ONE_MINUS_DST_ALPHA = 0x0305;

 // glFrontFace()
var GL_CW = 0x0900;
var GL_CCW = 0x0901;

 // glCullFace()
var GL_FRONT = 0x404;
var GL_BACK = 0x405;
var GL_FRONT_AND_BACK = 0x408;

 // glGetString(GLenum) -- return values
var GL_VENDOR = 0x1F00;
var GL_RENDERER = 0x1F01;
var GL_VERSION = 0x1F02;
var GL_EXTENSIONS = 0x1F03;

 // glClear(GLbitfield) -- bit masks
var GL_DEPTH_BUFFER_BIT = 0x00000100;
 // GL_ACCUM_BUFFER_BIT = 0x00000200; // WebGL.ACCUM_BUFFER_BIT is undefined.
var GL_STENCIL_BUFFER_BIT = 0x00000400;
var GL_COLOR_BUFFER_BIT = 0x00004000;

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
    GL.finish(); // slow fix to deferred buffer-and-draw render pipeline
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
    var canvas_attributes;
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

    canvas_attributes = {
        preserveDrawingBuffer: true, // needed to right-click, Save Image As...
        depth: true,
        alpha: true,
        antialias: true,
        premultipliedAlpha: true
    };
    try {
        GL = canvas.getContext("webgl", canvas_attributes);
        if (!GL) {
            GL = canvas.getContext("experimental-webgl", canvas_attributes);
         // alert("Warning:  Experimental WebGL implementation.");
        }
    } catch (error) {
        ML_interface.write("WebGL getContext() exception.<BR>" + error);
    }

    if (!GL) {
        return null;
    }
    GL_CONTEXT_LOST = GL.CONTEXT_LOST_WEBGL;

    var GLSL_scripts = [
        [`#line 1
attribute highp vec4 pos;
uniform float point_size;
void main(void) {
	gl_Position = vec4(pos);
	gl_PointSize = point_size;
}
`, `#line 1
uniform lowp vec4 const_color;
void main(void) {
	gl_FragColor = const_color;
}
`], // 4-dimensional positions with constant color
        [`#line 1
attribute highp vec4 pos;
uniform float point_size;
varying lowp vec4 outc;
attribute lowp vec4 col;
void main(void) {
	gl_Position = vec4(pos);
	gl_PointSize = point_size;
	outc = col;
}
`, `#line 1
varying lowp vec4 outc;
void main(void) {
	gl_FragColor = outc;
}
`], // 4-dimensional positions with 4-channel color
        [`#line 1
attribute highp vec4 pos;
uniform float point_size;
varying lowp vec3 outc;
attribute lowp vec3 col;
void main(void) {
	gl_Position = vec4(pos);
	gl_PointSize = point_size;
	outc = col;
}
`, `#line 1
varying lowp vec3 outc;
void main(void) {
	gl_FragColor = vec4(outc, 1.0);
}
`], // 4-dimensional positions with 3-channel color
        [`#line 1
attribute highp vec3 pos;
uniform float point_size;
void main(void) {
	gl_Position = vec4(pos, 1.0);
	gl_PointSize = point_size;
}
`, `#line 1
uniform lowp vec4 const_color;
void main(void) {
	gl_FragColor = const_color;
}
`], // 3-dimensional positions with constant color
        [`#line 1
attribute highp vec3 pos;
uniform float point_size;
varying lowp vec4 outc;
attribute lowp vec4 col;
void main(void) {
	gl_Position = vec4(pos, 1.0);
	gl_PointSize = point_size;
	outc = col;
}
`, `#line 1
varying lowp vec4 outc;
void main(void) {
	gl_FragColor = outc;
}
`], // 3-dimensional positions with 4-channel color
        [`#line 1
attribute highp vec3 pos;
uniform float point_size;
varying lowp vec3 outc;
attribute lowp vec3 col;
void main(void) {
	gl_Position = vec4(pos, 1.0);
	gl_PointSize = point_size;
	outc = col;
}
`, `#line 1
varying lowp vec3 outc;
void main(void) {
	gl_FragColor = vec4(outc, 1.0);
}
`], // 3-dimensional positions with 3-channel color
        [`#line 1
attribute highp vec2 pos;
uniform float point_size;
void main(void) {
	gl_Position = vec4(pos, 0.0, 1.0);
	gl_PointSize = point_size;
}
`, `#line 1
uniform lowp vec4 const_color;
void main(void) {
	gl_FragColor = const_color;
}
`], // 2-dimensional positions with constant color
        [`#line 1
attribute highp vec2 pos;
uniform float point_size;
varying lowp vec4 outc;
attribute lowp vec4 col;
void main(void) {
	gl_Position = vec4(pos, 0.0, 1.0);
	gl_PointSize = point_size;
	outc = col;
}
`, `#line 1
varying lowp vec4 outc;
void main(void) {
	gl_FragColor = outc;
}
`], // 2-dimensional positions with 4-channel color
        [`#line 1
attribute highp vec2 pos;
uniform float point_size;
varying lowp vec3 outc;
attribute lowp vec3 col;
void main(void) {
	gl_Position = vec4(pos, 0.0, 1.0);
	gl_PointSize = point_size;
	outc = col;
}
`, `#line 1
varying lowp vec3 outc;
void main(void) {
	gl_FragColor = vec4(outc, 1.0);
}
`] // 2-dimensional positions with 3-channel color
    ];
    GL_state.programs = [];
    GL_state.programs[0] = [];
    GL_state.programs[1] = [];
    GL_state.programs[2] = [];

    var temp_vertex_shader;
    var temp_fragment_shader;

    var p;
    var q;
    var i = 0;

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
 * Finally, we need to emulate the initial GL ES 1.0 state machine settings.
 *
 * Because shader-based "modern" OpenGL needs to emulate these using GLSL and
 * uniform attributes, we need to initialize the uniforms in this wrapper.
 */
    glColor4f(1.0, 1.0, 1.0, 1.0);
    glPointSize(1.0);
    glLineWidth(1.0);

// A few more calls to force correct default state machine flags can't hurt.
    glEnable(GL_BLEND);
    glBlendFunc(GL_ONE, GL_ZERO);
    glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
    glCullFace(GL_BACK);
    glFrontFace(GL_CCW);
    glDisable(GL_CULL_FACE);
    glDisable(GL_DITHER);
    glDisable(GL_STENCIL_TEST);
    glDisable(GL_DEPTH_TEST);
    glDisable(GL_SCISSOR_TEST);
    glDisable(GL_POLYGON_OFFSET_FILL);
    glDisable(GL_SAMPLE_ALPHA_TO_COVERAGE);
    glDisable(GL_SAMPLE_COVERAGE);

    glVertexPointer(4, GL_FLOAT, 0, 0);
    glDisableClientState(GL_VERTEX_ARRAY);
    glColorPointer(4, GL_FLOAT, 0, 0);
    glDisableClientState(GL_COLOR_ARRAY);

    glClearColor(0.0, 0.0, 0.0, 0.0);
    glClear(GL_COLOR_BUFFER_BIT + GL_DEPTH_BUFFER_BIT + GL_STENCIL_BUFFER_BIT);
    glFlush();
    glFinish();
    return (GL);
}
// @license-end
