export const generateSlots = (date, start, end, duration) => {
    let slots = []
    let current = new Date(`${date}T${start}:00`)
    let endTime = new Date(`${date}T${end}:00`)
    while (current < endTime) {
        let slotEnd = new Date(current.getTime() + duration * 60000)
        if (slotEnd > endTime) break
        slots.push({
            startAt: new Date(current),
            endAt: new Date(slotEnd)
        })
        current = slotEnd
    }
    return slots
}

export const formatDate = (date) => {
    return new Date(date).toLocaleString('sv-SE', {
        timeZone: 'Africa/Cairo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}