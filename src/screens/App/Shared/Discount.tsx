import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppSelector } from '../../../utils/hooks';
import basicService from '../../../redux/basic/basicService';
import Layout from '../../../components/Layout';
import GoBack from '../../../components/GoBack';
import colors from '../../../utils/colors';
import textStyles from '../../../styles/textStyles';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from '../../../components/Icon';
import { formatCommas } from '../../../utils/currency';
import { displayError } from '../../../utils/display';

const Discount = () => {
    const [amount, setAmount] = useState(0);
    const [total, setTotal] = useState<any>(null);

    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        getDiscount();
        getTotalDiscount();
    }, []);

    const getDiscount = async () => {
        try {
            let res = await basicService.getDiscount();
            if (res?.discountAmount) {
                setAmount(res.discountAmount);
            }
        } catch (err) {
            console.log(displayError(err, false));
        }
    };

    const getTotalDiscount = async () => {
        try {
            let res = await basicService.getUnusedDiscount();
            if (res) {
                setTotal(res);
            }
        } catch (err) {}
    };

    return (
        <Layout>
            <GoBack
                bgColor={colors.dark}
                iconColor={colors.white}
                title="Discounts"
            />
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: '8%',
                    paddingVertical: 40,
                }}
            >
                <View style={styles.textBox}>
                    <Text style={[textStyles.text, { fontSize: 14 }]}>
                        You can share your referral code with friends and family
                        for ₦{(amount / 100).toLocaleString()} discount.
                    </Text>
                    <Text style={[textStyles.text, { fontSize: 14 }]}>
                        NB: The more referral, the more discount.
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 20,
                    }}
                >
                    <View style={styles.refCode}>
                        <Text
                            style={{
                                fontFamily: 'regular',
                                fontSize: 14,
                                marginBottom: 3,
                            }}
                        >
                            Your referral code
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginVertical: 20,
                            }}
                        >
                            <Text style={{ fontSize: 14, fontFamily: 'bold' }}>
                                {user.discountCode}
                            </Text>

                            <TouchableOpacity
                                onPress={async () =>
                                    Clipboard.setString(`${user.discountCode}`)
                                }
                            >
                                <Icon
                                    type="ionicons"
                                    size={23}
                                    color={colors.black}
                                    name="copy"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.shareContainer}
                        onPress={() =>
                            Share.share({
                                message: `Use this code “${
                                    user.discountCode
                                }” for ₦${amount.toLocaleString()} discount off your booking as a new customer`,
                            })
                        }
                    >
                        <Icon
                            type="ionicons"
                            name="share-social"
                            color={colors.white}
                            size={20}
                        />
                        <Text style={styles.share}>Share</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.3)',
                        paddingVertical: 20,
                        borderRadius: 20,
                        alignItems: 'center',
                        marginTop: 20,
                    }}
                >
                    <Text style={[textStyles.text, { fontSize: 12 }]}>
                        Your Total Discount
                    </Text>
                    {total ? (
                        <Text
                            style={[
                                textStyles.textBold,
                                { fontSize: 18, marginTop: 10 },
                            ]}
                        >
                            ₦ {formatCommas(total.grandTotal / 100)}
                        </Text>
                    ) : (
                        <ActivityIndicator
                            color={colors.primary}
                            style={{ marginTop: 10 }}
                        />
                    )}
                </View>
            </View>
        </Layout>
    );
};

export default Discount;

const styles = StyleSheet.create({
    textBox: {
        width: '100%',
        backgroundColor: colors.appGray,
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
    },
    refCode: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 15,
        backgroundColor: '#c7efedd6',
        padding: 10,
        width: '60%',
    },
    shareContainer: {
        backgroundColor: colors.primary,
        width: '37%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
    },

    share: {
        color: colors.white,
        marginLeft: 5,
    },
});
