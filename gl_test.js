function main_GL() {
    "use strict";
    var triangle = [-1, -1, 0, 1, +1, -1, 0, 1, 0, +1, 0, 1];
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

    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(4, GL_FLOAT, 0, triangle);
    glDrawArrays(GL_TRIANGLES, 0, 3);
    glDisableClientState(GL_VERTEX_ARRAY);

    glFlush();
    glFinish();

 // trace(glGetString(GL_VENDOR));
    trace(glGetString(GL_RENDERER));
    trace(glGetString(GL_VERSION));
 // trace(glGetString(GL_EXTENSIONS));

    error_code = glGetError();
    if (error_code !== GL_NO_ERROR) {
        trace_error(error_code);
    }
    return;
}
