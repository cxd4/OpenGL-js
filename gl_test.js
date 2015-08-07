function main_GL() {
    "use strict";
    var x = 0, y = 1;//, z = 2, w = 3
    var r = 0, g = 1, b = 2;//, a = 3
    var coordinates_per_vertex = 2;
    var channels_per_color = 3;

    var triangle = [];
    var colors = [];
    var error_code;

    triangle[0 * coordinates_per_vertex + x] = 0.0;
    triangle[0 * coordinates_per_vertex + y] = 1.0;

    triangle[1 * coordinates_per_vertex + x] = -Math.sqrt(3) / 2;
    triangle[1 * coordinates_per_vertex + y] = -0.5;

    triangle[2 * coordinates_per_vertex + x] = +Math.sqrt(3) / 2;
    triangle[2 * coordinates_per_vertex + y] = -0.5;

    colors[0 * channels_per_color + r] = 1;
    colors[0 * channels_per_color + g] = 0;
    colors[0 * channels_per_color + b] = 0;

    colors[1 * channels_per_color + r] = 0;
    colors[1 * channels_per_color + g] = 0;
    colors[1 * channels_per_color + b] = 1;

    colors[2 * channels_per_color + r] = 0;
    colors[2 * channels_per_color + g] = 1;
    colors[2 * channels_per_color + b] = 0;

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
    glVertexPointer(coordinates_per_vertex, GL_FLOAT, 0, triangle);

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
