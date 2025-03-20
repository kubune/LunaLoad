const base = Module.getBaseAddress("libg.so");

const PlayerProfile_getStat = base.add(0x903700);

const fameData = {
    "1": {"min": 0, "max": 1999},
    "2": {"min": 2000, "max": 3999},
    "3": {"min": 4000, "max": 5999},
    "4": {"min": 6000, "max": 9199},
    "5": {"min": 9200, "max": 12399},
    "6": {"min": 12400, "max": 15599},
    "7": {"min": 15600, "max": 20099},
    "8": {"min": 20100, "max": 24599},
    "9": {"min": 24600, "max": 29099},
    "10": {"min": 29100, "max": 37099},
    "11": {"min": 37100, "max": 45099},
    "12": {"min": 45100, "max": 53099},
    "13": {"min": 53100, "max": 65099},
    "14": {"min": 65100, "max": 77099},
    "15": {"min": 77100, "max": 89099},
    "16": {"min": 89100, "max": 109099},
    "17": {"min": 109100, "max": 129099},
    "18": {"min": 129100, "max": 149099},
    "19": {"min": 149100, "max": 199099},
    "20": {"min": 199100, "max": 249099},
    "21": {"min": 249100, "max": 299099}
};

let fame = 0;

Interceptor.attach(PlayerProfile_getStat, {
    onEnter(args) {
        this.a2 = args[1];
    },
    onLeave(retval) {
        if (this.a2 == 20) { // Get fame stat
            fame = retval.toInt32();
        }
    }
});

Interceptor.attach(StringTable_getString, {
    onEnter(args) {
        this.value = Memory.readUtf8String(args[0]);
    },
    onLeave(retval) {
        if (this.value == "TID_PREVIOUS_STATS_TITLE") {
            let titleString = Utils.ReadStringFromStringObject(retval);
            let fameLevel = 0;
            for (let i = 0; i <= 20; i++) {
                const key = String(i + 1);
                if (fameData[key] && fameData[key].min <= fame && fameData[key].max >= fame) {
                    fameLevel = i + 1;
                    break;
                }
            }

            if (fame !== 0 && fameLevel > 0 && fameData[String(fameLevel)]) { 
                let progressText = "FAME: <cDF9D11>" + 
                    (fame - fameData[String(fameLevel)].min) + "/" +
                    (fameData[String(fameLevel)].max - fameData[String(fameLevel)].min + 1) + "</c>";
                     titleString = `${progressText}\n\n` + titleString;
                     retval.replace(Utils.createStringObject(titleString));
            }
        }
    }
});