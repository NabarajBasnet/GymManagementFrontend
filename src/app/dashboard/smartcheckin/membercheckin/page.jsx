'use client';

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    MapPin,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    Activity,
    Play,
    Square,
    Search,
    Wifi,
    WifiOff,
    User,
    Calendar,
    Phone,
    CreditCard,
    Crown,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react"
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { toast } from "sonner";

const gymLocation = {
    lat: 27.7121,
    lng: 85.3201,
    radius: 100,
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

const SmartAttendanceDashboard = () => {
    const { user: loggedInUser } = useUser();
    const user = loggedInUser?.user;
    const features = user?.tenant?.subscription?.subscriptionFeatures
    const multiBranchSupport = features?.find((feature) => {
        return feature.toString() === 'Multi Branch Support'
    })
    const onFreeTrail = user?.tenant?.freeTrailStatus === 'Active';

    const enableMemberCheckInFlag = async () => {
        try {
            let resBody = null;

            if (multiBranchSupport || onFreeTrail) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizationbranch/toggle-membercheckin-flag`, {
                    method: "PUT",
                });
                resBody = await response.json();

            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organization/toggle-member-checkin`, {
                    method: "PUT",
                });
                resBody = await response.json();
            }

            consol.log(resBody);
        } catch (error) {
            console.log('Error: ', error.message)
            toast.error(error.message);
        };
    };

    const [location, setLocation] = useState(null)
    const [sessionActive, setSessionActive] = useState(false)
    const [withinRange, setWithinRange] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [attendanceLogs, setAttendanceLogs] = useState([
        { id: 1, memberName: "John Doe", category: "Premium", membership: "Monthly", timestamp: new Date(Date.now() - 3600000) },
        { id: 2, memberName: "Sarah Wilson", category: "Basic", membership: "Yearly", timestamp: new Date(Date.now() - 7200000) },
        { id: 3, memberName: "Mike Johnson", category: "Premium", membership: "Monthly", timestamp: new Date(Date.now() - 10800000) },
    ])
    const [showAttendanceList, setShowAttendanceList] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)

    // Mock member data for demonstration
    const mockMember = {
        id: 1,
        name: "John Doe",
        category: "Premium",
        membership: "Monthly",
        membershipExpiry: "2025-08-15",
        phone: "+977-9841234567",
        joinedDate: "2024-01-15",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }

    useEffect(() => {
        if (!sessionActive) return

        const watch = navigator.geolocation.watchPosition(
            (pos) => {
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                }
                setLocation(coords)

                const dist = getDistanceFromLatLonInMeters(
                    coords.lat,
                    coords.lng,
                    gymLocation.lat,
                    gymLocation.lng
                )

                const inRange = dist <= gymLocation.radius
                setWithinRange(inRange)

                // Mock member detection when in range
                if (inRange && !currentMember) {
                    setIsSearching(true)
                    setTimeout(() => {
                        setCurrentMember(mockMember)
                        setIsSearching(false)
                    }, 1500)
                } else if (!inRange && currentMember) {
                    setCurrentMember(null)
                    setIsSearching(false)
                }
            },
            (err) => {
                console.error("Location error", err)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )

        return () => navigator.geolocation.clearWatch(watch)
    }, [sessionActive, currentMember])

    const startSession = () => {
        setSessionActive(true)
    }

    const stopSession = () => {
        setSessionActive(false)
        setCurrentMember(null)
        setWithinRange(false)
        setIsSearching(false)
    }

    const checkInMember = () => {
        if (currentMember) {
            const newLog = {
                id: Date.now(),
                memberName: currentMember.name,
                category: currentMember.category,
                membership: currentMember.membership,
                timestamp: new Date()
            }
            setAttendanceLogs([newLog, ...attendanceLogs])
            setCurrentMember(null)
            setWithinRange(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Socket Check In System
                        </h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                        Track member check-ins using socket and geo based availability
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
                    {/* Session Control Card */}
                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-100">
                                <div className="p-2 bg-blue-500/20 dark:bg-blue-500/30 rounded-lg">
                                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                Attendance Session Control
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Enable live session to track member check-ins within gym premises
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <MapPin className="h-4 w-4 text-blue-500" />
                                        Current Location
                                    </div>
                                    {location ? (
                                        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                                                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <p className="text-sm text-slate-400 dark:text-slate-500">Location unavailable</p>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <Wifi className="h-4 w-4 text-emerald-500" />
                                        Detection Range
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{gymLocation.radius}m radius</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Session Status:</span>
                                    <Badge
                                        variant={sessionActive ? "default" : "secondary"}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 transition-all duration-[2000] ${sessionActive
                                            ? "bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse"
                                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                                            }`}
                                    >
                                        {sessionActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                        {sessionActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={startSession}
                                    disabled={sessionActive}
                                    className="flex-1 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                                >
                                    <Play className="h-4 w-4 mr-2" />
                                    {sessionActive ? "Session Running" : "Start Session"}
                                </Button>
                                <Button
                                    onClick={stopSession}
                                    disabled={!sessionActive}
                                    className="flex-1 py-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                                >
                                    <Square className="h-4 w-4 mr-2" />
                                    Stop Session
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Member Details Card */}
                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-100">
                                <div className="p-2 bg-purple-500/20 dark:bg-purple-500/30 rounded-lg">
                                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                Member Detection
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Information about detected member
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {isSearching ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-spin">
                                        <Search className="h-8 w-8 text-white" />
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Detecting member...</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        Scanning for registered members in range
                                    </p>
                                </div>
                            ) : currentMember ? (
                                <div className="space-y-4 animate-in fade-in-50 duration-500">
                                    <div className="text-center">
                                        <div className="relative inline-block">
                                            <img
                                                src={currentMember.photo}
                                                alt={currentMember.name}
                                                className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-purple-300 dark:border-purple-500 shadow-lg"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                                <CheckCircle className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{currentMember.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Member ID: #{currentMember.id}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Crown className="h-4 w-4 text-amber-500" />
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Category:</span>
                                            </div>
                                            <Badge variant={currentMember.category === "Premium" ? "default" : "secondary"} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                                {currentMember.category}
                                            </Badge>
                                        </div>

                                        <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Membership:</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{currentMember.membership}</span>
                                        </div>

                                        <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-emerald-500" />
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Expiry:</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{currentMember.membershipExpiry}</span>
                                        </div>

                                        <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-purple-500" />
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone:</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{currentMember.phone}</span>
                                        </div>

                                        <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-indigo-500" />
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Joined:</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{currentMember.joinedDate}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            onClick={checkInMember}
                                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Check In Member
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                        <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No member detected</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        {sessionActive ? "Waiting for member to come in range..." : "Start session to detect members"}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Attendance Log Card */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                    <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-t-lg">
                        <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-100">
                            <div className="p-2 bg-indigo-500/20 dark:bg-indigo-500/30 rounded-lg">
                                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            Today's Attendance
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">
                            View all member check-ins for today
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <Badge variant="outline" className="text-sm font-medium px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300">
                                {attendanceLogs.length} Check-ins Today
                            </Badge>
                            <Button
                                onClick={() => setShowAttendanceList(!showAttendanceList)}
                                variant="outline"
                                size="sm"
                                className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-600 dark:hover:to-slate-500 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-300"
                            >
                                {showAttendanceList ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                {showAttendanceList ? "Hide List" : "Show List"}
                            </Button>
                        </div>

                        <div className={`transition-all duration-500 ease-in-out ${showAttendanceList ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {attendanceLogs.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Clock className="h-12 w-12 mx-auto mb-3 text-slate-400 dark:text-slate-500" />
                                        <p className="text-slate-400 dark:text-slate-500 text-sm">No check-ins yet today</p>
                                    </div>
                                ) : (
                                    attendanceLogs.map((log, index) => (
                                        <div
                                            key={log.id}
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-300 animate-in fade-in-50"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{log.memberName}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{log.category} • {log.membership}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{log.timestamp.toLocaleTimeString()}</p>
                                                <Badge variant="secondary" className="text-xs mt-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Checked In
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default SmartAttendanceDashboard;
