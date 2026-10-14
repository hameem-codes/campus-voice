const fs = require('fs')
const path = 'c:/Users/matee/OneDrive/Desktop/campusvoice/data/mockData.ts'

let content = fs.readFileSync(path, 'utf8')

// Replace initialUpdates and initialNotifications with getInitialUpdates and getInitialNotifications
const updatesAndNotifsCode = `export function getInitialUpdates(baseDate: Date = new Date()): UpdateItem[] {
  const d = generateRelativeDates(baseDate)

  return [
    {
      id: 'exam',
      title: 'Mid-semester examination schedule released',
      category: 'Exams',
      priority: 'Urgent',
      status: 'Published',
      excerpt: 'Check your course-wise slots and make a note of the room changes for Friday in the Main Hall.',
      content: \`Mid-semester examinations for Autumn Term 2026 begin soon. All students are requested to download the updated course-wise schedule and verify seating arrangements.

Key instructions:
1. Carry your physical Student ID card to each examination room.
2. Friday's DES 204 and CS 301 sessions will take place in Main Hall rather than Studio 2.
3. Electronic devices and smartwatches are strictly prohibited inside the hall.
4. For accommodation requests, contact the Academic Office.\`,
      department: 'Academic Office',
      postedAt: d.examPosted,
      eventDate: d.examEvent,
      deadlineDate: d.examEvent,
      publisher: {
        name: 'Academic Office',
        role: 'Official notice',
        email: 'academics@campus.edu',
      },
      read: false,
      saved: false,
      readBy: [],
      savedBy: [],
      attachments: [
        { id: 'att-1', name: 'MidSem_Schedule_2026.pdf', size: '1.2 MB', type: 'pdf' },
        { id: 'att-2', name: 'Seating_Arrangements_MainHall.pdf', size: '840 KB', type: 'pdf' },
      ],
      audience: {
        departments: ['School of Design', 'Computer Science'],
        years: ['Year 2', 'Year 3'],
        sections: ['D2', 'CS1', 'CS2'],
        isUniversal: false,
        label: 'Targeted: Design & CS (Y2/Y3)',
      },
      editHistory: [
        { date: d.examPosted, author: 'Academic Office', action: 'Published with urgent priority' },
      ],
      reachPercentage: 94,
      viewsCount: 540,
      readsCount: 480,
    },
    {
      id: 'fee',
      title: 'Fee payment window closes this Friday',
      category: 'Fees',
      priority: 'Normal',
      status: 'Published',
      excerpt: 'The portal stays open until 11:59 PM. Installment requests can be raised from finance.',
      content: \`The Autumn Term fee collection portal will close this Friday at 11:59 PM.

Students who require staggered payment plans or corporate sponsor invoicing should submit the fee variance form directly to the Finance Office before Thursday noon. Late fees of $50 per day will apply to unconfirmed balances after deadline.\`,
      department: 'Finance & Accounts',
      postedAt: d.feePosted,
      eventDate: d.feeDeadline,
      deadlineDate: d.feeDeadline,
      publisher: {
        name: 'Finance Office',
        role: 'Student services',
        email: 'finance@campus.edu',
      },
      read: true,
      saved: true,
      readBy: ['user-student-1'],
      savedBy: ['user-student-1'],
      attachments: [
        { id: 'att-fee-1', name: 'Fee_Structure_Autumn2026.pdf', size: '640 KB', type: 'pdf' },
      ],
      audience: {
        departments: [],
        years: [],
        sections: [],
        isUniversal: true,
        label: 'All students',
      },
      editHistory: [
        { date: d.feePosted, author: 'Finance Office', action: 'Published notice' },
      ],
      reachPercentage: 88,
      viewsCount: 2110,
      readsCount: 1850,
    },
    {
      id: 'placement',
      title: 'Northstar Labs pre-placement talk',
      category: 'Placements',
      priority: 'Normal',
      status: 'Published',
      excerpt: 'A 45-minute session on product roles, followed by an open Q&A in the auditorium.',
      content: \`Northstar Labs will visit campus in the Main Auditorium.

This session is open to graduating Design and Computer Science students interested in Junior Product Designer, Software Engineer, and Design Technologist positions. Please bring your resume and portfolio QR links.\`,
      department: 'Career Services',
      postedAt: d.placementPosted,
      eventDate: d.placementEvent,
      publisher: {
        name: 'Placement Cell',
        role: 'Student services',
        email: 'careers@campus.edu',
      },
      read: false,
      saved: true,
      readBy: [],
      savedBy: ['user-student-1'],
      attachments: [
        { id: 'att-northstar', name: 'Northstar_Job_Descriptions.pdf', size: '2.1 MB', type: 'pdf' },
      ],
      audience: {
        departments: ['School of Design', 'Computer Science'],
        years: ['Year 2', 'Year 3', 'Year 4'],
        sections: [],
        isUniversal: false,
        label: 'Design & CS Students',
      },
      editHistory: [
        { date: d.placementPosted, author: 'Placement Cell', action: 'Published talk details' },
      ],
      reachPercentage: 76,
      viewsCount: 420,
      readsCount: 310,
    },
    {
      id: 'holiday',
      title: 'Campus closed for Founders Day',
      category: 'Holidays',
      priority: 'Normal',
      status: 'Published',
      excerpt: 'Classes and shuttle services pause on holiday. Residence halls remain open.',
      content: \`In honor of Founders Day, administrative offices and academic departments will be closed.

Key details:
- Dining commons will operate on Sunday holiday brunch hours.
- Campus emergency medical services and library quiet zones remain accessible via keycard.\`,
      department: 'Administration',
      postedAt: d.holidayPosted,
      eventDate: d.holidayEvent,
      publisher: {
        name: 'Admin Office',
        role: 'Official notice',
        email: 'admin@campus.edu',
      },
      read: true,
      saved: false,
      readBy: ['user-student-1'],
      savedBy: [],
      attachments: [],
      audience: {
        departments: [],
        years: [],
        sections: [],
        isUniversal: true,
        label: 'Campus-wide',
      },
      editHistory: [
        { date: d.holidayPosted, author: 'Admin Office', action: 'Published holiday calendar' },
      ],
      reachPercentage: 99,
      viewsCount: 2380,
      readsCount: 2310,
    },
    {
      id: 'result',
      title: 'Semester 4 results are now available',
      category: 'Results',
      priority: 'Normal',
      status: 'Published',
      excerpt: 'View your marksheet from the academic records page. Contact your department for corrections.',
      content: \`The Registrar's Office has officially verified and uploaded Semester 4 grade cards.

Students can review their GPA calculations, course credits, and transcript records on the portal. Any discrepancy petitions must be submitted through the Department Academic Coordinator within 7 working days.\`,
      department: 'Academic Office',
      postedAt: d.resultPosted,
      publisher: {
        name: 'Registrar Office',
        role: 'Academic records',
        email: 'registrar@campus.edu',
      },
      read: true,
      saved: false,
      readBy: ['user-student-1'],
      savedBy: [],
      attachments: [
        { id: 'att-res-1', name: 'Grading_Policy_Addendum.pdf', size: '420 KB', type: 'pdf' },
      ],
      audience: {
        departments: ['School of Design', 'Computer Science'],
        years: ['Year 2'],
        sections: [],
        isUniversal: false,
        label: 'Year 2 Undergraduates',
      },
      editHistory: [
        { date: d.resultPosted, author: 'Registrar Office', action: 'Published results announcement' },
      ],
      reachPercentage: 91,
      viewsCount: 560,
      readsCount: 512,
    },
    {
      id: 'event',
      title: 'Design club open studio this evening',
      category: 'Events',
      priority: 'Normal',
      status: 'Published',
      excerpt: 'Drop in for a hands-on typography workshop with materials provided by the club.',
      content: \`The Student Design Collective cordially invites all members of the campus community to an Open Studio session in Studio D2.

We will experiment with wooden movable type, risograph printing, and letterpress techniques. Materials and snacks will be provided.\`,
      department: 'School of Design',
      postedAt: d.eventPosted,
      eventDate: d.eventEvent,
      publisher: {
        name: 'Design Club',
        role: 'Student community',
        email: 'designclub@campus.edu',
      },
      read: false,
      saved: false,
      readBy: [],
      savedBy: [],
      attachments: [
        { id: 'att-poster', name: 'Open_Studio_Poster.png', size: '1.8 MB', type: 'image' },
      ],
      audience: {
        departments: ['School of Design'],
        years: [],
        sections: [],
        isUniversal: false,
        label: 'School of Design',
      },
      editHistory: [
        { date: d.eventPosted, author: 'Design Club', action: 'Published event flyer' },
      ],
      reachPercentage: 62,
      viewsCount: 140,
      readsCount: 95,
    },
    {
      id: 'critique',
      title: 'Design systems critique session',
      category: 'Events',
      priority: 'Urgent',
      status: 'Published',
      excerpt: 'Mandatory interim critique for DES 204 students in Studio 2.',
      content: \`Interim project review for DES 204: Design Systems. All students enrolled in section D2 must pin up their component documentation and prototype boards by 9:00 AM tomorrow.\`,
      department: 'School of Design',
      postedAt: d.critiquePosted,
      eventDate: d.critiqueEvent,
      deadlineDate: d.critiqueEvent,
      publisher: {
        name: 'Dr. Maya Rao',
        role: 'Faculty Instructor',
        email: 'maya.rao@campus.edu',
      },
      read: false,
      saved: true,
      readBy: [],
      savedBy: ['user-student-1'],
      attachments: [
        { id: 'att-rubric', name: 'Critique_Rubric_DES204.pdf', size: '310 KB', type: 'pdf' },
      ],
      audience: {
        departments: ['School of Design'],
        years: ['Year 2'],
        sections: ['D2'],
        isUniversal: false,
        label: 'DES 204 Section D2',
      },
      editHistory: [
        { date: d.critiquePosted, author: 'Dr. Maya Rao', action: 'Created and published' },
      ],
      reachPercentage: 100,
      viewsCount: 48,
      readsCount: 42,
    },
    {
      id: 'fac-update-1',
      title: 'Research grant call: Spring 2027',
      category: 'Scholarships',
      priority: 'Normal',
      status: 'Pending',
      excerpt: 'Faculty seed funding proposals for multi-disciplinary laboratory equipment.',
      content: \`Proposals are invited from faculty members for internal seed grants up to $15,000. Applications should detail research objectives, laboratory infrastructure requirements, and undergraduate research involvement.\`,
      department: 'Academic Office',
      postedAt: d.facUpdate1Posted,
      publisher: {
        name: 'Dr. Maya Rao',
        role: 'Faculty',
        email: 'maya.rao@campus.edu',
      },
      read: false,
      saved: false,
      readBy: [],
      savedBy: [],
      attachments: [
        { id: 'att-grant-app', name: 'Seed_Grant_Guidelines_2027.pdf', size: '950 KB', type: 'pdf' },
      ],
      audience: {
        departments: ['School of Design', 'Computer Science'],
        years: [],
        sections: [],
        isUniversal: false,
        label: 'Faculty & Researchers',
      },
      editHistory: [
        { date: d.facUpdate1Posted, author: 'Dr. Maya Rao', action: 'Submitted for Admin Approval' },
      ],
      reachPercentage: 0,
      viewsCount: 4,
      readsCount: 2,
    },
    {
      id: 'fac-update-2',
      title: 'Course registration reminder for Spring',
      category: 'Timetable',
      priority: 'Normal',
      status: 'Scheduled',
      excerpt: 'Elective course add/drop opens on schedule at 9:00 AM.',
      content: \`Reminder that Spring elective selections will open soon. Ensure prerequisite reviews are cleared with your academic counselor before the deadline.\`,
      department: 'Academic Office',
      postedAt: d.facUpdate2Posted,
      eventDate: d.facUpdate2Event,
      publisher: {
        name: 'Dr. Maya Rao',
        role: 'Faculty',
        email: 'maya.rao@campus.edu',
      },
      read: true,
      saved: false,
      readBy: [],
      savedBy: [],
      attachments: [],
      audience: {
        departments: [],
        years: [],
        sections: [],
        isUniversal: true,
        label: 'All students',
      },
      editHistory: [
        { date: d.facUpdate2Posted, author: 'Dr. Maya Rao', action: 'Scheduled for publication' },
      ],
      reachPercentage: 0,
      viewsCount: 0,
      readsCount: 0,
    },
    {
      id: 'fac-update-draft',
      title: 'Studio safety guidelines revision',
      category: 'Events',
      priority: 'Normal',
      status: 'Draft',
      excerpt: 'Updated protocols for laser cutters, 3D printers, and woodshop machinery.',
      content: \`Draft protocols for after-hours shop access. Still awaiting signature from Facilities coordinator.\`,
      department: 'School of Design',
      postedAt: d.facDraftPosted,
      publisher: {
        name: 'Dr. Maya Rao',
        role: 'Faculty',
        email: 'maya.rao@campus.edu',
      },
      read: true,
      saved: false,
      readBy: [],
      savedBy: [],
      attachments: [],
      audience: {
        departments: ['School of Design'],
        years: [],
        sections: [],
        isUniversal: false,
        label: 'Design Students & Staff',
      },
      editHistory: [
        { date: d.facDraftPosted, author: 'Dr. Maya Rao', action: 'Created draft' },
      ],
      reachPercentage: 0,
      viewsCount: 0,
      readsCount: 0,
    },
  ]
}

export const initialUpdates: UpdateItem[] = getInitialUpdates()

export function getInitialNotifications(baseDate: Date = new Date()): NotificationItem[] {
  const d = generateRelativeDates(baseDate)

  return [
    {
      id: 'notif-1',
      updateId: 'exam',
      title: 'Exam schedule released',
      message: 'Your Friday room has changed to Main Hall.',
      type: 'urgent',
      timestamp: d.examPosted,
      read: false,
    },
    {
      id: 'notif-2',
      updateId: 'fee',
      title: 'Fee payment reminder',
      message: 'Two days remain to complete your payment before portal closes.',
      type: 'reminder',
      timestamp: d.feePosted,
      read: false,
    },
    {
      id: 'notif-3',
      updateId: 'critique',
      title: 'Critique session tomorrow',
      message: 'Mandatory pin-up for DES 204 at 9:00 AM.',
      type: 'urgent',
      timestamp: d.critiquePosted,
      read: false,
    },
    {
      id: 'notif-4',
      updateId: 'result',
      title: 'Semester 4 results published',
      message: 'Review your semester grade card on the academic portal.',
      type: 'info',
      timestamp: d.resultPosted,
      read: true,
    },
  ]
}

export const initialNotifications: NotificationItem[] = getInitialNotifications()
`

const startMarker = 'export const initialUpdates: UpdateItem[] = ['
const endMarker = 'export const initialAuditLogs: AuditLogItem[] = ['

const startIndex = content.indexOf(startMarker)
const endIndex = content.indexOf(endMarker)

if (startIndex !== -1 && endIndex !== -1) {
  content = content.slice(0, startIndex) + updatesAndNotifsCode + '\n' + content.slice(endIndex)
  fs.writeFileSync(path, content, 'utf8')
  console.log('Successfully updated mockData.ts')
} else {
  console.error('Markers not found', { startIndex, endIndex })
}
