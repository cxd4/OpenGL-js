var coordinates_per_vertex = 4;

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
    var old_angle, new_angle;
    var i;

/*
 * Draw the unit circle (a circle with a radius of 1.0) to circumscribe
 * the perfect triangle, which will be drawn in front of it.
 */
 // glDrawArrays(GL_LINE_LOOP, 0 + 1, circle_precision);
    glDrawArrays(GL_TRIANGLE_FAN, 0, circle_precision + 1 + 1);

    old_angle = index_buffer[0] * (360 / circle_precision) - 90;
    if (old_angle < 0) {
        old_angle += 360;
    }

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

    new_angle = index_buffer[0] * (360 / circle_precision) - 90;
    if (new_angle < 0) {
        new_angle += 360;
    }

/*
 * If we have just now crossed in between one of the 3 120-degree portions of
 * the circle, then it becomes necessary to synchronize all of the colors.
 */
 // if (true) {
 // if (global_count >= circle_precision / 3) {
    if (old_angle % 120 > new_angle % 120) {
        synchronise_colors();
        glColorPointer(channels, GL_FLOAT, 0, colors);
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

    synchronise_colors();
    if (channels >= 4) {
        for (i = 0; i < circle_precision + 1 + 1; i += 1) {
            colors[channels * i + 3] = 0.80;
        }
    }
    glDisableClientState(GL_COLOR_ARRAY);
    glColorPointer(channels, GL_FLOAT, 0, colors);

    glEnable(GL_BLEND);
 // glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);

    glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
    glClearColor(0.00, 0.00, 0.00, 0.00);
    glClear(GL_COLOR_BUFFER_BIT);

    glCullFace(GL_BACK);
    glFrontFace(GL_CCW);
    glDisable(GL_CULL_FACE);

    glPointSize(1.0);
    glLineWidth(1);
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

function synchronise_colors() {
    var i, j;
    var rotate_CCW_by_120_deg = circle_precision / 3;

    for (i = 0; i < rotate_CCW_by_120_deg; i += 1) {
        j = (index_buffer[0] + i) % (circle_precision + 1);
        if (j === 0) {
            j = 1;
            rotate_CCW_by_120_deg += 1;
        } // Skip the binding center point of circle (not part of the tri).
        colors[channels * j + 0] = 1.0000; // red
        colors[channels * j + 1] = 0.0000;
        colors[channels * j + 2] = 0.0000;
    }

    rotate_CCW_by_120_deg = circle_precision / 3;
    for (i = 0; i < rotate_CCW_by_120_deg; i += 1) {
        j = (index_buffer[1] + i) % (circle_precision + 1);
        if (j === 0) {
            j = 1;
            rotate_CCW_by_120_deg += 1;
        }
        colors[channels * j + 0] = 0.0000;
        colors[channels * j + 1] = 0.0000;
        colors[channels * j + 2] = 1.0000; // blue
    }

    rotate_CCW_by_120_deg = circle_precision / 3;
    for (i = 0; i < rotate_CCW_by_120_deg; i += 1) {
        j = (index_buffer[2] + i) % (circle_precision + 1);
        if (j === 0) {
            j = 1;
            rotate_CCW_by_120_deg += 1;
        }
        colors[channels * j + 0] = 0.0000;
        colors[channels * j + 1] = 1.0000; // green
        colors[channels * j + 2] = 0.0000;
    }
    return;
}
