import type { FamilyMember } from '../types';

export const generateICS = (member: FamilyMember) => {
  const dob = new Date(member.dateOfBirth);
  const now = new Date();
  
  // Create a recurring event for every year
  // Format: YYYYMMDD
  const year = now.getFullYear();
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const day = String(dob.getDate()).padStart(2, '0');
  
  const startDate = `${year}${month}${day}`;
  
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Family Birthday Tracker//NONSGML v1.0//EN',
    'BEGIN:VEVENT',
    `UID:${member.id}@familytracker.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `SUMMARY:${member.name}'s Birthday 🎂`,
    `DESCRIPTION:Family Birthday Tracker Event for ${member.name} (${member.relation})`,
    'RRULE:FREQ=YEARLY',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return icsLines.join('\r\n');
};

export const downloadICS = (member: FamilyMember) => {
  const content = generateICS(member);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${member.name}-birthday.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
