
export const formatHorario = (horario: string): string  => {
    
    if(horario.length === 4 ) {
        return `${horario.slice(0,2)}:${horario.slice(2)}`
    }

    return horario

}