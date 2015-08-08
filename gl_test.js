var circle = [];

function display() {
    "use strict";
    var triangle = [
        0, 1,
        -Math.sqrt(3) / 2, -0.5,
        +Math.sqrt(3) / 2, -0.5
    ];
    var colors = [
        1, 0, 0,
        0, 0, 1,
        0, 1, 0
    ];

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

    glColor4f(1, 1, 1, 1);
    glEnableClientState(GL_VERTEX_ARRAY);

/*
 * Draw the unit circle (a circle with a radius of 1.0) to circumscribe
 * the perfect triangle, which will be drawn in front of it.
 */
    glVertexPointer(2, GL_FLOAT, 4 * 4, circle);
    glDrawArrays(GL_TRIANGLE_FAN, 0, 360 + 1 + 1);

    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(2, GL_FLOAT, 0, triangle);

    glEnableClientState(GL_COLOR_ARRAY);
    glColorPointer(3, GL_FLOAT, 0, colors);

 // glDrawArrays(GL_TRIANGLES, 0, 3);
    glDrawElements(GL_TRIANGLES, 3, GL_UNSIGNED_BYTE, [0, 1, 2]);

    glDisableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_COLOR_ARRAY);

    glFlush();
    glFinish();
    return;
}

function init() {
    "use strict";
    var i;

    circle[4 * 0 + 0] = circle[4 * 0 + 1] = 0.0;
    for (i = 0 + 1; i < 360 + 1; i += 1) {
        circle[4 * i + 0] = Math.cos(i * Math.PI / 180);
        circle[4 * i + 1] = Math.sin(i * Math.PI / 180);
    }
    circle[4 * i + 0] = circle[4 * 1 + 0];
    circle[4 * i + 1] = circle[4 * 1 + 1];

    glEnable(GL_BLEND);
    glEnable(GL_CULL_FACE);

    glClearColor(0.00, 0.00, 0.00, 0.00);
    glClear(GL_COLOR_BUFFER_BIT);

    glCullFace(GL_BACK);
    glFrontFace(GL_CCW);

    glPointSize(8.0);
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
    setInterval(display, 3000);
    do {
        error_code = glGetError();
        console.log("OpenGL error status:  " + error_code);
    } while (error_code !== GL_NO_ERROR);
    return;
}
