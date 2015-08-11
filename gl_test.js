var coordinates_per_vertex = 4;

var angles = [
    0 * (360 / 3) * (Math.PI / 180) + (Math.PI / 2),
    1 * (360 / 3) * (Math.PI / 180) + (Math.PI / 2),
    2 * (360 / 3) * (Math.PI / 180) + (Math.PI / 2)
];
var circle = [];
var colors = [];
var triangle = [];

var frames_per_second = 10;

function display() {
    "use strict";

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

    glColor4f(1, 1, 1, 1);
    glEnableClientState(GL_VERTEX_ARRAY);

/*
 * Draw the unit circle (a circle with a radius of 1.0) to circumscribe
 * the perfect triangle, which will be drawn in front of it.
 */
    glVertexPointer(coordinates_per_vertex, GL_FLOAT, 0, circle);
 // glDrawArrays(GL_LINE_LOOP, 0 + 1, 360);
    glDrawArrays(GL_TRIANGLE_FAN, 0, 360 + 1 + 1);

    glVertexPointer(coordinates_per_vertex, GL_FLOAT, 0, triangle);

    glEnableClientState(GL_COLOR_ARRAY);
    glColorPointer(4, GL_FLOAT, 0, colors);

    glDrawArrays(GL_TRIANGLES, 0, 3);
    animate_triangle(60 / frames_per_second);

    glDisableClientState(GL_COLOR_ARRAY);
    return;
}

function init() {
    "use strict";
    var i, j;

    circle[0] = circle[1] = circle[2] = 0.0;
    circle[3] = 1.0;
    for (i = 0 + 1; i < 360 + 1; i += 1) {
        circle[coordinates_per_vertex * i + 0] = Math.cos(i * Math.PI / 180);
        circle[coordinates_per_vertex * i + 1] = Math.sin(i * Math.PI / 180);
        if (coordinates_per_vertex > 2) {
            circle[coordinates_per_vertex * i + 2] = 0.0;
        }
        if (coordinates_per_vertex > 3) {
            circle[coordinates_per_vertex * i + 3] = 1.0;
        }
    }
    for (j = 0; j < coordinates_per_vertex; j += 1) {
        circle[coordinates_per_vertex * i + j]
      = circle[coordinates_per_vertex * 1 + j];
    }

    triangle[coordinates_per_vertex * 0 + 0] = Math.cos(90 * Math.PI / 180);
    triangle[coordinates_per_vertex * 0 + 1] = Math.sin(90 * Math.PI / 180);
    triangle[coordinates_per_vertex * 1 + 0] = Math.cos(210 * Math.PI / 180);
    triangle[coordinates_per_vertex * 1 + 1] = Math.sin(210 * Math.PI / 180);
    triangle[coordinates_per_vertex * 2 + 0] = Math.cos(330 * Math.PI / 180);
    triangle[coordinates_per_vertex * 2 + 1] = Math.sin(330 * Math.PI / 180);

    if (coordinates_per_vertex > 2) {
        for (i = 0; i < 3; i += 1) {
            triangle[coordinates_per_vertex * i + 2] = 0.0;
        }
    }
    if (coordinates_per_vertex > 3) {
        for (i = 0; i < 3; i += 1) {
            triangle[coordinates_per_vertex * i + 3] = 1.0;
        }
    }

    colors = [
        1, 0, 0, 1.00,
        0, 0, 1, 1.00,
        0, 1, 0, 1.00
    ];

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

function animate_triangle(degrees) {
    "use strict";
    var i = 0;
    var radians = degrees * Math.PI / 180.0;
    var radians_in_360_degress = 360 * Math.PI / 180.0;

    angles[0] += radians;
    angles[1] += radians;
    angles[2] += radians;
    do {
        if (angles[i] >= radians_in_360_degress) {
            angles[i] -= radians_in_360_degress;
        }
        i += 1;
    } while (i < 3);

    triangle[0 * coordinates_per_vertex + 0] = Math.cos(angles[0]);
    triangle[0 * coordinates_per_vertex + 1] = Math.sin(angles[0]);
    triangle[1 * coordinates_per_vertex + 0] = Math.cos(angles[1]);
    triangle[1 * coordinates_per_vertex + 1] = Math.sin(angles[1]);
    triangle[2 * coordinates_per_vertex + 0] = Math.cos(angles[2]);
    triangle[2 * coordinates_per_vertex + 1] = Math.sin(angles[2]);

    return;
}
