require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { 
    inquirerMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar
} = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

console.clear();

const main = async() => {
    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if (tareasDB) {
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {
        // inquirerMenu: Impresion del menu en consola.
        opt = await inquirerMenu();

        switch (opt) {
            case '1': // Crear tarea
                const desc = await leerInput('Descripcion: ');
                tareas.creartarea(desc);
                break;
            case '2': // Listar tareas
               tareas.listadoCompleto();
                break;
            case '3': // Listar tareas completadas
                tareas.listarPendientesCompletadas(true);
                break;
            case '4': // Listar tareas pendientes
                tareas.listarPendientesCompletadas(false);
                break;
            case '6': // Borrar
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0') {
                    const ok = await confirmar('¿Está seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }
                break;
        }

        guardarDB( tareas.listadoArr );
        await pausa();
    } while (opt !== '0');
};

main();