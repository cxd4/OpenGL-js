var coordinates_per_vertex = 4;
var attribs_interleaved = 1; /* Multiply by 1 for "false". :) */
/*
 * Interleaved arrays are, on some implementations, faster than storing
 * color and vertex position arrays separately, but with the JavaScript
 * language then I do not know how to implement them, because normally for
 * interleaved arrays addressing offsets into static memory need to be
 * prepared, and I don't think JavaScript has much "addressing" concept.
 */

var circle = [];

var channels = 4;
var colors = [];

/*
 * Circles conceptually cannot exist in hardware-accelerated graphics, so we
 * have to draw something like a 360-sided regular polygon. (Though, usually
 * something less than a quarter that precise is still a convincing circle.)
 */
var circle_precision = 180;

var rotate_CCW_by_90_degrees = circle_precision / 4;
var index_buffer = [
    0*circle_precision/3 + rotate_CCW_by_90_degrees,
    1*circle_precision/3 + rotate_CCW_by_90_degrees,
    2*circle_precision/3 + rotate_CCW_by_90_degrees,
];

var frames_per_second = 60;

function display() {
    "use strict";
    var i;

/*
    glDisable(GL_CULL_FACE);
    glColor4f(1, 0, 0, 0.50);
    glRectf(0, 0, -1, -1);
    glColor4f(0, 1, 0, 0.50);
    glRectf(0, 0, +1, -1);
    glColor4f(0, 0, 1, 0.50);
    glRectf(0, 0, +1, +1);
    glColor4f(1, 1, 0, 0.50);
    glRectf(0, 0, -1, +1);
    glEnable(GL_CULL_FACE);
*/

/*
 * Draw the unit circle (a circle with a radius of 1.0) to circumscribe
 * the perfect triangle, which will be drawn in front of it.
 */
 // glDrawArrays(GL_LINE_LOOP, 0 + 1, circle_precision);
    glDrawArrays(GL_TRIANGLE_FAN, 0, circle_precision + 1 + 1);

    colors[channels * index_buffer[0] + 0] = 1.0000; // red
    colors[channels * index_buffer[0] + 1] = 0.0000;
    colors[channels * index_buffer[0] + 2] = 0.0000;

    colors[channels * index_buffer[1] + 0] = 0.0000;
    colors[channels * index_buffer[1] + 1] = 0.0000;
    colors[channels * index_buffer[1] + 2] = 1.0000; // blue

    colors[channels * index_buffer[2] + 0] = 0.0000;
    colors[channels * index_buffer[2] + 1] = 1.0000; // green
    colors[channels * index_buffer[2] + 2] = 0.0000;

    glColorPointer(channels, GL_FLOAT, 0, colors);
    glEnableClientState(GL_COLOR_ARRAY);
    glDrawElements(GL_TRIANGLES, 3, GL_UNSIGNED_BYTE, index_buffer);
    glDisableClientState(GL_COLOR_ARRAY);

    for (i = 0; i < 3; i += 1) {
        index_buffer[i] += 60 / frames_per_second;
        if (index_buffer[i] >= circle_precision + 1) {
            index_buffer[i] %= circle_precision + 1;
            index_buffer[i] += 1; /* Element 0 is just the center of the fan. */
        } /* Element (n + 1) is just a copy of the fan's first triangle vtx.. */
    }
    return;
}

function init() {
    "use strict";
    var i, j;
    var radius = 1.0; /* Unit circle has a radius of (r = 1). */

/*
 * Behind the rainbow triangle will be a semitransparent indigo circle.
 * Why indigo?  Meh.  Cool color.
 *
 * Because of the transparency blending both the triangle and the circle
 * to the checkerboard background, most shades of indigo in this test case
 * will be misinterpreted commonly as purple or magenta.
 */
    glColor4f(0.333, 0.000, 0.667, 0.5);

    circle[0] = circle[1] = circle[2] = 0.0;
    circle[3] = 1.0;
    for (i = 0 + 1; i < circle_precision + 1; i += 1) {
        var x, y, z;
        var degrees, radians;

        degrees = i * (360 / circle_precision);
        radians = degrees * (Math.PI / 180.0);

        x = Math.cos(radians) / radius;
        y = Math.sin(radians) / radius;
        z = Math.sqrt(Math.abs(radius*radius - x*x - y*y));
        circle[coordinates_per_vertex * i + 0] = x;
        circle[coordinates_per_vertex * i + 1] = y;
        circle[coordinates_per_vertex * i + 2] = z*0; // Spheres don't work yet.
        if (coordinates_per_vertex > 3) {
            circle[coordinates_per_vertex * i + 3] = 1.0 / radius;
        }
    }
    for (j = 0; j < coordinates_per_vertex; j += 1) {
        circle[coordinates_per_vertex * i + j]
      = circle[coordinates_per_vertex * 1 + j];
    }
    glVertexPointer(coordinates_per_vertex, GL_FLOAT, 0, circle);

    glEnableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_COLOR_ARRAY);
    for (i = 0; i < circle_precision + 1 + 1; i += 1) {
        colors[channels * i + 0] = 0.50;
        colors[channels * i + 1] = 0.50;
        colors[channels * i + 2] = 0.50;
        if (channels >= 4) {
            colors[channels * i + 3] = 0.80;
        }
    }

    glEnable(GL_BLEND);
    glDisable(GL_CULL_FACE);

    glClearColor(0.00, 0.00, 0.00, 0.00);
    glClear(GL_COLOR_BUFFER_BIT);

    glCullFace(GL_BACK);
    glFrontFace(GL_CCW);

    glPointSize(1.0);
    glLineWidth(1);

    glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
    return;
}

function main_GL() {
    "use strict";
    var error_code;

    if (GL_initialize(document, "GL_canvas") === null) {
        alert("Failed to initialize WebGL.");
        return;
    }

 // console.log("GL_VENDOR    :  " + glGetString(GL_VENDOR));
    console.log("GL_RENDERER  :  " + glGetString(GL_RENDERER));
    console.log("GL_VERSION   :  " + glGetString(GL_VERSION));
 // console.log("GL_EXTENSIONS:  " + glGetString(GL_EXTENSIONS));

    init();
    setInterval(display, 1000 / frames_per_second);
    do {
        error_code = glGetError();
        console.log("OpenGL error status:  " + error_code);
    } while (error_code !== GL_NO_ERROR);
    return;
}
