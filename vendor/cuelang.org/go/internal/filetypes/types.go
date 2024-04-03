// Code generated by gocode.Generate; DO NOT EDIT.

package filetypes

import (
	"fmt"

	"cuelang.org/go/cue"
	"cuelang.org/go/encoding/gocode/gocodec"
	_ "cuelang.org/go/pkg"
)

var cuegenCodec, cuegenInstance_, cuegenValue = func() (*gocodec.Codec, *cue.Instance, cue.Value) {
	var r *cue.Runtime
	r = &cue.Runtime{}
	instances, err := r.Unmarshal(cuegenInstanceData)
	if err != nil {
		panic(err)
	}
	if len(instances) != 1 {
		panic("expected encoding of exactly one instance")
	}
	return gocodec.New(r, nil), instances[0], instances[0].Value()
}()

// Deprecated: cue.Instance is deprecated. Use cuegenValue instead.
var cuegenInstance = cuegenInstance_

// cuegenMake is called in the init phase to initialize CUE values for
// validation functions.
func cuegenMake(name string, x interface{}) cue.Value {
	f, err := cuegenValue.FieldByName(name, true)
	if err != nil {
		panic(fmt.Errorf("could not find type %q in instance", name))
	}
	v := f.Value
	if x != nil {
		w, err := cuegenCodec.ExtractType(x)
		if err != nil {
			panic(err)
		}
		v = v.Unify(w)
	}
	return v
}

// Data size: 1703 bytes.
var cuegenInstanceData = []byte("\x01\x1f\x8b\b\x00\x00\x00\x00\x00\x00\xff\xc4X\u074b\xe4\xc6\x11\x97\xf6.\x105N\x1e\ry\b\xd4\xe9\xc08\xcbE\x8b?\xc8\xc3\xc0r\x84\xdc]\xb8\x978\x04\xe7\u0258\xa1G*\xcdt,u+\xdd-{\x17\xef\x90\xc4q\xf2g{Cu\xb7\u0512F\xbb{\v\x0e\u0797\x9d\xa9_WuUu}\xce/n\xffs\x96\x9e\xdd\xfe7Io\xff\x99$\xbf\xfb\u01d34}OHc\xb9,\xf1\x15\xb7\x9c\xc8\xe9\x93\xf4\xe9_\x94\xb2\xe9Y\x92>\xfd3\xb7\x87\xf4\xbd$\xfd\xd9\x1b\u0460Io\xbfO\x92\xe4\u05f7\xff>K\xd3_~\xf1e\xd9cQ\x8b&p~\x9f\xa4\xb7\xdf%\u0247\xb7\xffz\x92\xa6?\x8f\xf4\xef\x92\xf4,}\xfa'\xde\"\tz\xea\x88,I\x92\x1f\xde\xff\x15)\x92\xa6gi\x9a\xd9\xeb\x0eMQ\xf6\x98\xfe\xf0~\xd2\xf1\xf2+\xbeG\xd8\xf5\xa2\xa9\x18\xbb\xb8\x80\xdf\x03\xdd\x0f\xa5\xd2\x1aM\xa7de\xc0*\xe0\xf0G\xe5\x0f\x15\x04\x17\xec9\xfd\xdb\xc0\xb7,\xa3\xeb%oq\x03\xe1\xcfX-\xe4\x9ee(KU\t\xb9\x1f\x81\xe7\xaf\x03\x85eBZ\u051dF\u02edP\xf2\xe5\x06\x9e\xbf\x9dQXV+\u077e\x1cY\x89\xfb\x8d\xd2-\xcb,\u07db\x97\xee\xe2\xec\v\x7f\u04d7\x9b\xf1\xca#;:#^a\xcd\xfb\u01820`\x0f\b\xa4\"\xf4\x06+\xa8\x95\x06c+!\x81\u02ca>\xa9\xde\x16\xf0\xf9\x01\xc1\xa0\xb5B\xee\rT\u0621\xacH\x8a\x92\x91\xbbU\x15Y\x1d\x04o\xc0\xd9\x0f\x1f\xcc\x1dp\x9e\xff6\x87\x9bA\x9b\xe3\u011foe\xad\xa0\xc2ZH4pP\xdf\x00\xf7b\x85\x01\xe7&\xac\x9cB\xa3[\xb0\n.&Fg\xad\xfb\u01b2\x8a[\x1e\xbdrnu\x8fp\x035o\f\xb2Lc\x8d\x1ae\x89fs\n\x96\xd7e\xe3\x81\x15N\xa7\x9a \xcf\u04c9\x9dR\r\xcbTG\xdfy\xe3Y<\xadT\xd2X\u0345\xb4\xf1\xdcW\x88]\xf0\x8b\xd9\x04\x9a\x90\xa5j\xbb\x06\xad\v\x8b@k;\xa5\xed\xa0\x81\xa7\x19\xab\x91\xb7\x83R\x9eV\xa9\xd2D\x13=\x8d[\xab\u016e\xb7\xde\x00G\xf3\xee\xa5w1\xf4x\xf4p^\a\xf7\u0215\xa8\x9d/,\xa8\x0e5\xf7\x96\xf8\xd3\x05\xbb\xb8 \xd6\xcf\x0fh\x10,\xb6]\xc3-\x1a\xe0\x1a\xdd\x03Hz\r\xab`\x87\xd0KQ\v\xa4w\x01n]0h\xa5,\xa8\x1a\xecA\x18\x12R*Y\x8b}\xefo(\x98\xbb\xc0\xbd\x97\x90]o}\x9c6h\xe1\n.\xdd\xe7\x99u\x8bG\xc8ff.\xc1#\u02f2\x18\x7fNV\u0330\xf3\xbc\xec\x91boK\xf4\xa2(\x06\x86\x18CW,2\x98 \xa0\xec)j)\xd5La\xca\x03\xb6<\x88 ^\xbc\xb2(\x8d\x0f\tw:/\xfef\x94\xcc\u00f7E\x0e\x93\x0e\xbc\xb7jT\xe2\xe8Y\xaey\xdb<\x96\xe5q\x1cG\xca\xfb\f\xaf(\xba&\x0e\xdf~\xb4\xe6\xf2\xe0\xd4\xf3U\x97/\xc1\a\\\xee\xbcq\xbf\u03f7\x1f=\xe0u\xca\xe7\xe8\xf3#\xcbT\xdf\xd9Y\xe0l?\xfeq\xec\x98j\xf5\xf1c\xb5\u00af\xa9\x0eD\x9d>\xf9\x7f\xfb\xf6\xe1p\xde~\xf2\x80\x11\xb5\xa0\x94\x9fZQa=5\xe2\u04df>'\xb7\x9f>2+\x87\x0e\xf7zHNhyg|3\x89\tK\xe5+\x94C\x0fu\x9a\u02a0\x15T\xfd\x16y\x9d\xe7\xd3.\xbbeYN\xc3\xc1H\xa4~K\x04\x16\xd3?\u04890\x00M@F\xa0!\xa4\xa9\"\xd3\x1c\x91w\"\xa1dDiD`caX\x01\uc55d\x03\x16\xaf,\x01{\x15\xads\xc0^\x11\xb9\xd3\u02aa\xa9\xbe\x8e\xe0$\xe1\x95\x1d\xd0Q\xd2\x1c\xddMt\x8e(\u02e8\xa5|\xf6\xea\xb3\r\x90!\x06\xff\xfe\u0091\xf2b`\x18\x99vBv;\xb8\xb8\x80\x9d\x90\\_w\xbbqT\x18\x06$\x10\xb2\x12\xa5\xefJ\xfe\x01)\x1a\xb8u\xadMc\xa7\u0460\xa4q\x058=\xed^\xf3\xb6`\xe3x\xb5\x81g\x97y\xeeEJ\x98\x0fVP\xa1E\xddN\xe6\x90\x12\xb5\xe5B\x0er\xc0\x1cT\xdfT\xd4\xfdf\xd3\xc8\xc5\x05\xbcQ\x1a\x86\x11\xf6\x05\xb8\x1a\xd1\xf2\xeb\xc5I\xe0\u0509M\xa9\xc5\xce\xeb\xe7#\xf8\x05|s\x10\xe5\x01\x845\xd8\u052esrI\xac\xa5\x92_\xa3\xb6\xbe\xe5r\xf8\xc3__\a\x8e\x82-f\xc2q\xccs\x93\xe04h\x03\xbdv#\xe9\x98^\xcb\xe9,\xaf\x95\xf2!\xec\xa7K/!\xf7\xb7\xe5\xe1\r\xe8\x81|J\x95\xaami&k\x84DO\xb6\xea4\x99\bpi\xe4\xc5\xf8\f\xf6\xd2G\u0254\xb7{\u037b\xc3\fu\x14\x0fV|?\x83*\xbe\x1f\x00\xcb\x17\x88\r\x02]\x91\xf8\x96M\v\x8e\xab7\x0e$+O\xd0`z\x80\x9bU\xbc\xf1\a(\xafNp\x97\x96\x0ev\x11\x7f\x82\xfb\xb4q\a\u01b489\x14\xf3\x8b\x0e\xba\f\xe9v4\x06\xbb\xf1\x1c\x85=\xa0&G\x0f\t\x10r\x04\x06\x11/@\xcdp\x96u\xbb\r\x9c\xcfo\xf1\x7f\xf9\x90^9;\x9d#r\xba\x1fn`\x8d\xf1\xd9\xe5\xfd\xac\x8e\x1c\xac\\50\x1f\x1f\xcc\xe9\x11\x1f\u034b=\xe1\xf1\xe4;\xb9\xf6'n\f\x06\xd2\xe2p\x97q\xd9\x18\x99Y\xd6pw\u035e\x9c\x1eZ!\xb1\xfe(R\x87\xd5+\u0225\xe9\xcc\xe3'\xecnp[\xb9p6H\x85\xe8\x9cf\u04c9\xa0x\xe0]\u0129\x0e%\xef\xc4\x1d\xb2\x02\xfa\x0e\x82|}p]y\xdc\xe4Bw\xa6\xaa\u031b\u0183\x05\xbc\xb5P)4 \x95\x05!\u02e6\xaf\xd0/\x92J\xb7\xf0\xf6U\xc1\xdc9\xa7\x90[cia\xbf\x1cw\u0671~9\xed\xa9;o\u05ea\v\x8cZ\x06W\xc0\r\xe4n\xe4q\x9f\x86\xea\xb2\u0630\x96S\xd8|O[\x8e7\xf3\xadp\x89\xce\xf7\xc3\x0fg\xf0o\xe0\x83%\x85e\x8b\xedq)o\xbeG.\xd1\xf9\xf6\xb8@\x8fT\xe7\xe50\xa2N'\xa7\x13\x7f\x05\x1f\x9d\u0737nU\x94\x7fR\xc0\xe3\x03x_\x93\u05e9p\xfb\xff.w\x17\xdb:\xe9|\xe2\xf3u_\u07eb\xcd\u008f\xeb\xfe[\xf7[\xb4g\xd6sL\xe1l\x98\xd8\xf6\xec2\x86\xd0\xf0\xcb\xc1\x94y\u0697h_\xd8/\xfd\xf2\xec2\xb4\xb1\xb9\xb6\x83Z\xb3\x9f*F\xbb\xa6?Q\xac\x1a\xb0\xea\x97Q\xaf#\x9b\x8f\xd2c\x8f\x1c\x92 Z\x10;d\xdcx\x16\xd9\xe2\x93\x04n\x86w\x9bn\t\x83\x1e\xd3\xe5 \n\x8f\xeds\xee\u0719\x1a\x94\x86^\xf2\xbc#\xaf\xea3\x1e\x8c=g\xf5\\\xd4a\xdaj\x1e8jU{\xdf\xdd\xf1\u0925/r\xec\x9d\u0180\x99\xf4;f\x82\xc9\v,m\xa1F\x7f\x9f\x98i\xcf^\x93\x12[\xdeB\xf9\x13C\x8fl\xde'\x1eQ\xab\xdd\x06\xe5\x9b\xe0\xfc\x96eW\xbb\u04c1\xf7\xf6\xafw\xe6Zu\xd62\x9a\x8e,I\xfe\x17\x00\x00\xff\xffj\xd7\xe3\u00e8\x16\x00\x00")
