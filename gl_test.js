var frames_per_second = 60;

var coordinates_per_vertex = 2;
var channels = 4;

/*
 * Circles conceptually cannot exist in hardware-accelerated graphics, so we
 * have to draw something like a 360-sided regular polygon. (Though, usually
 * something less than a quarter that precise is still a convincing circle.)
 */
var circle_precision = 180;
var circle = [];

var angles = [
    0 + 90,
    120 + 90,
    240 + 90
];

var triangle = [
    null, null, 0.0, 1.0,
    null, null, 0.0, 1.0,
    null, null, 0.0, 1.0
];

function display() {
    "use strict";
    var radians;
    var i;

/*
 * Draw the unit circle (a circle with a radius of 1.0) to circumscribe
 * the perfect triangle, which will be drawn in front of it.
 */
    glVertexPointer(coordinates_per_vertex, GL_FLOAT, 0, circle);
 // glDrawArrays(GL_LINE_LOOP, 0 + 1, circle_precision);
    glDrawArrays(GL_TRIANGLE_FAN, 0, circle_precision + 1 + 1);

    i = 0;
    while (i < 3) {
        radians = angles[i] * Math.PI / 180;
        triangle[i * coordinates_per_vertex + 0] = Math.cos(radians);
        triangle[i * coordinates_per_vertex + 1] = Math.sin(radians);
        i += 1;
    }
    glVertexPointer(coordinates_per_vertex, GL_FLOAT, 0, triangle);

    glEnableClientState(GL_COLOR_ARRAY);
    glDrawElements(GL_TRIANGLES, 3, GL_UNSIGNED_BYTE, [0, 1, 2]);
    glDisableClientState(GL_COLOR_ARRAY);

    i = 0;
    while (i < 3) {
        angles[i] += 360 / circle_precision;
        i += 1;
    }
    return;
}

function init() {
    "use strict";
    var i, j;
    var radius = 1.0; /* Unit circle has a radius of (r = 1). */
    var colors = [
        1, 0, 0, 0.80,
        0, 0, 1, 0.80,
        0, 1, 0, 0.80
    ];

/*
 * Behind the rainbow triangle will be a semitransparent indigo circle.
 * Why indigo?  Meh.  Cool color.
 *
 * Because of the transparency blending both the triangle and the circle
 * to the checkerboard background, most shades of indigo in this test case
 * will be misinterpreted commonly as purple or magenta.
 */
    glColor4f(0.333, 0.000, 0.667, 0.5);

    circle[0] = circle[1] = 0.0;
    if (coordinates_per_vertex > 2) {
        circle[0 * coordinates_per_vertex + 2] = 0;
    }
    if (coordinates_per_vertex > 3) {
        circle[0 * coordinates_per_vertex + 3] = 1.0 / radius;
    }
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
        if (coordinates_per_vertex > 2) {
            circle[coordinates_per_vertex * i + 3] = z * 0; // doesn't work
        }
        if (coordinates_per_vertex > 3) {
            circle[coordinates_per_vertex * i + 3] = 1.0 / radius;
        }
    }
    for (j = 0; j < coordinates_per_vertex; j += 1) {
        circle[coordinates_per_vertex * i + j]  // vertex beyond final vertex...
      = circle[coordinates_per_vertex * 1 + j]; // ...respecifies first vertex
    }
    glEnableClientState(GL_VERTEX_ARRAY);

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
