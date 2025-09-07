"use client";

import { useState, useMemo } from 'react';
import type { Attendance, AttendanceStatus } from '@/lib/types';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Check, X, HelpCircle, Users, BarChart2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

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

  const { present, absent, maybe } = useMemo(() => {
    const present = attendance.filter(a => a.status === 'present');
    const absent = attendance.filter(a => a.status === 'absent');
    const maybe = attendance.filter(a => a.status === 'maybe');
    return { present, absent, maybe };
  }, [attendance]);

  const chartData = [
    { name: 'Présents', value: present.length, fill: 'hsl(var(--primary))' },
    { name: 'Absents', value: absent.length, fill: 'hsl(var(--destructive))' },
    { name: 'Incertains', value: maybe.length, fill: 'hsl(var(--muted-foreground))' },
  ];

  return (
    <>
      <Card>
        <CardContent className="p-4">
            <p className="font-semibold text-gray-700 mb-3">Ma disponibilité</p>
            <div id="attendance-buttons" className="grid grid-cols-3 gap-2">
                <AttendanceButton status="present" currentStatus={myStatus} onClick={handleStatusChange}>Présent</AttendanceButton>
                <AttendanceButton status="absent" currentStatus={myStatus} onClick={handleStatusChange}>Absent</AttendanceButton>
                <AttendanceButton status="maybe" currentStatus={myStatus} onClick={handleStatusChange}>Incertain</AttendanceButton>
            </div>
        </CardContent>
      </Card>
        
      <Tabs defaultValue="participants" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="participants"><Users className="mr-2" />Participants</TabsTrigger>
          <TabsTrigger value="stats"><BarChart2 className="mr-2" />Statistiques</TabsTrigger>
        </TabsList>
        <TabsContent value="participants">
            <Card>
                <CardContent className="p-4 space-y-3 text-sm">
                    <AttendanceList category="Présents" count={present.length} names={present.map(p => p.userName)} color="text-green-600" />
                    <AttendanceList category="Absents" count={absent.length} names={absent.map(p => p.userName)} color="text-red-600" />
                    <AttendanceList category="Incertains" count={maybe.length} names={maybe.map(p => p.userName)} color="text-yellow-600" />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="stats">
          <Card>
            <CardContent className="p-2">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
        present: 'bg-green-600 text-white hover:bg-green-700',
        absent: 'bg-red-600 text-white hover:bg-red-700',
        maybe: 'bg-yellow-500 text-white hover:bg-yellow-600',
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
