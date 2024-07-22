export const formatDateToCustomString = (date: Date): string => {
    const day = date.getDate();
    const monthNames = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Obtenha a diferença de fuso horário em horas
    const timezoneOffset = -date.getTimezoneOffset() / 60;
    const timezone = `UTC${timezoneOffset >= 0 ? `+${timezoneOffset}` : timezoneOffset}`;

    return `${day} de ${month} de ${year} às ${hours}:${minutes}:${seconds} ${timezone}`;
};

