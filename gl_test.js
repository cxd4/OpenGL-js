function main_GL() {
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
    var error_code;

    if (GL_initialize(document, "GL_canvas") === null) {
        alert("Failed to initialize WebGL.");
        return;
    }

    glClearColor(0.00, 0.00, 0.00, 0.00);
    glClear(GL_COLOR_BUFFER_BIT);

    glColor4f(1, 0, 0, 1);
    glRectf(-1, -1, 0, 0);
    glColor4f(0, 1, 0, 1);
    glRectf(0, -1, 1, 0);
    glColor4f(0, 0, 1, 0);
    glRectf(0, 0, 1, 1);
    glColor4f(1, 1, 0, 0);
    glRectf(-1, 0, 0, 1);

    glEnableClientState(GL_COLOR_ARRAY);
    glColorPointer(3, GL_FLOAT, 0, colors);

    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(2, GL_FLOAT, 0, triangle);

 // glDrawArrays(GL_TRIANGLES, 0, 3);
    glDrawElements(GL_TRIANGLES, 3, GL_UNSIGNED_BYTE, [0, 1, 2]);

    glDisableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_COLOR_ARRAY);

    glFlush();
    glFinish();

 // console.log("GL_VENDOR    :  " + glGetString(GL_VENDOR));
    console.log("GL_RENDERER  :  " + glGetString(GL_RENDERER));
    console.log("GL_VERSION   :  " + glGetString(GL_VERSION));
 // console.log("GL_EXTENSIONS:  " + glGetString(GL_EXTENSIONS));

    do {
        error_code = glGetError();
        console.log("OpenGL error status:  " + error_code);
    } while (error_code !== GL_NO_ERROR);
    return;
}
