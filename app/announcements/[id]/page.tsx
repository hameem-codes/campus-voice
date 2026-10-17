'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { StudentAnnouncementDetailView } from '@/views/student/StudentAnnouncementDetailView'

export default function AnnouncementDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id || ''

  return <StudentAnnouncementDetailView noticeId={id} />
}
