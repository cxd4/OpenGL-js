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

    glClearColor(0.00, 0.00, 0.00, 0.00);
    glClear(GL_COLOR_BUFFER_BIT);

/*
    glColor4f(1, 0, 0, 1);
    glRect(-1, -1, 0, 0);
    glColor4f(0, 1, 0, 1);
    glRect(0, -1, 1, 0);
    glColor4f(0, 0, 1, 0);
    glRect(0, 0, 1, 1);
    glColor4f(1, 1, 0, 0);
    glRect(-1, 0, 0, 1);
*/
 // glColor4f(0.25, 0.00, 0.50, 1.00);

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

 // trace("GL_VENDOR    :  " + glGetString(GL_VENDOR));
    trace("GL_RENDERER  :  " + glGetString(GL_RENDERER));
    trace("GL_VERSION   :  " + glGetString(GL_VERSION));
 // trace("GL_EXTENSIONS:  " + glGetString(GL_EXTENSIONS));

    do {
        error_code = glGetError();
        trace_GL_error("OpenGL error status", error_code);
    } while (error_code !== GL_NO_ERROR);
    return;
}
