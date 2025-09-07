"use client";

import { useState } from 'react';
import type { Attendance, AttendanceStatus } from '@/lib/types';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Check, X, HelpCircle } from 'lucide-react';

interface EventDetailsClientProps {
  eventId: string;
  initialAttendance: Attendance[];
}

export default function EventDetailsClient({ eventId, initialAttendance }: EventDetailsClientProps) {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [myStatus, setMyStatus] = useState<AttendanceStatus | null>(null);
  const { toast } = useToast();

  const handleStatusChange = (status: AttendanceStatus) => {
    // In a real app, you would make an API call here to update the backend.
    setMyStatus(status);
    console.log(`Setting status for event ${eventId} to ${status}`);
    toast({
      title: "Disponibilité mise à jour !",
      description: `Vous avez indiqué : ${status === 'present' ? 'Présent(e)' : status === 'absent' ? 'Absent(e)' : 'Incertain(e)'}`,
    });
    
    // Mock updating the attendance list
    const updatedAttendance = [...attendance.filter(a => a.userId !== 'mock_user_id'), { userId: 'mock_user_id', userName: 'Vous', status }];
    setAttendance(updatedAttendance);
  };

  const present = attendance.filter(a => a.status === 'present');
  const absent = attendance.filter(a => a.status === 'absent');
  const maybe = attendance.filter(a => a.status === 'maybe');

  return (
    <>
      <div className="bg-white p-4 rounded-lg border">
        <p className="font-semibold text-gray-700 mb-3">Ma disponibilité</p>
        <div id="attendance-buttons" className="grid grid-cols-3 gap-2">
            <AttendanceButton status="present" currentStatus={myStatus} onClick={handleStatusChange}>Présent</AttendanceButton>
            <AttendanceButton status="absent" currentStatus={myStatus} onClick={handleStatusChange}>Absent</AttendanceButton>
            <AttendanceButton status="maybe" currentStatus={myStatus} onClick={handleStatusChange}>Incertain</AttendanceButton>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-700 mb-3">Participants</h3>
        <div id="attendance-list" className="space-y-3 text-sm">
            <AttendanceList category="Présents" count={present.length} names={present.map(p => p.userName)} color="text-green-600" />
            <AttendanceList category="Absents" count={absent.length} names={absent.map(p => p.userName)} color="text-red-600" />
            <AttendanceList category="Incertains" count={maybe.length} names={maybe.map(p => p.userName)} color="text-yellow-600" />
        </div>
      </div>
    </>
  );
}

const AttendanceButton = ({ status, currentStatus, onClick, children }: { status: AttendanceStatus, currentStatus: AttendanceStatus | null, onClick: (status: AttendanceStatus) => void, children: React.ReactNode }) => {
    const isActive = status === currentStatus;
    const variantClasses = {
        present: 'border-green-500 text-green-600 hover:bg-green-50 focus:bg-green-100',
        absent: 'border-red-500 text-red-600 hover:bg-red-50 focus:bg-red-100',
        maybe: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50 focus:bg-yellow-100',
    };
    const activeClasses = {
        present: 'bg-green-500 text-white',
        absent: 'bg-red-500 text-white',
        maybe: 'bg-yellow-500 text-white',
    };
    return (
        <Button 
            variant="outline"
            onClick={() => onClick(status)}
            className={cn('border-2 font-semibold py-2 h-auto transition-colors', variantClasses[status], isActive && activeClasses[status])}
        >
            {children}
        </Button>
    )
}

const AttendanceList = ({ category, count, names, color }: { category: string, count: number, names: string[], color: string }) => {
    return (
        <div className={color}>
            <strong className="font-semibold">{count} {category}:</strong>
            <span className="ml-1 text-gray-600">{names.length > 0 ? names.join(', ') : 'Personne'}</span>
        </div>
    )
}
