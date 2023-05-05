let calendarElement = document.getElementById('calendar');

if(calendarElement) {
    document.addEventListener('DOMContentLoaded', () => {
        const rows = document.getElementById("allTicketTable").getElementsByTagName('tr');
        let eventObj = {
            events: [],
            color: 'purple',
            textColor: 'white'
        };
        
        for(let row of rows) {
            const rowArr = row.getElementsByTagName('td');
            const event = {
                title: rowArr[0].innerText,
                url: rowArr[0].getElementsByTagName('a')[0],
                allDay: true
            }
            let startDate = rowArr[3].innerHTML;
            let endDate = rowArr[4].innerHTML;
            const isInvalidStart = !startDate || typeof startDate !== 'string' || startDate === 'N/A';
            const isInvalidEnd = !endDate || typeof endDate !== 'string' || endDate === 'N/A';

            if(isInvalidStart && isInvalidEnd) {
                return;
            } else if(isInvalidStart) {
                startDate = endDate;
            } else if(isInvalidEnd) {
                endDate = startDate;
            }

            event['start'] = new Date(startDate).toISOString();
            event['end'] = new Date(endDate).toISOString();

            eventObj.events.push(event);
        }

        var calendar = new FullCalendar.Calendar(calendarElement, {
          initialView: 'dayGridMonth',
          timeZone: 'UTC',
          events: eventObj
        });

        calendar.render();
    });
}