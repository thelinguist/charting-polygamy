import React, { useState } from "react"
import { Treemap, hierarchy, treemapSquarify } from "@visx/hierarchy"
import { Group } from "@visx/group"
import type { Timeline } from "lib/src/types"
import { BG, AXIS_COLOR } from "../AggregateCharts/shared/colors"
import { SvgTooltip } from "../AggregateCharts/shared/SvgTooltip"
import styles from "./index.module.css"

// Archival warm palette — one tone per wife (cycles if > 10 wives)
const WIFE_COLORS = [
    "#8c5a3a",
    "#5a7a5a",
    "#5a7090",
    "#8a7a3a",
    "#8a5a6a",
    "#4a6a4a",
    "#4a7a7a",
    "#7c5fa0",
    "#9a4a2a",
    "#6a7a8a",
]

interface TreemapDatum {
    name: string
    wifeIndex: number
    value?: number
    children?: TreemapDatum[]
}

const TREEMAP_HEIGHT = 220

interface TooltipState {
    x: number
    y: number
    wifeName: string
    childCount: number
    grandchildCount?: number
}

interface Props {
    wives: Timeline[]
    patriarchName: string
    width: number
}

function buildChildrenData(wives: Timeline[]): TreemapDatum {
    return {
        name: "root",
        wifeIndex: -1,
        children: wives
            .filter(w => w.children.length > 0)
            .map((wife, i) => ({
                name: wife.name,
                wifeIndex: i,
                value: wife.children.length,
            })),
    }
}

function buildGrandchildrenData(wives: Timeline[]): TreemapDatum {
    return {
        name: "root",
        wifeIndex: -1,
        children: wives
            .filter(w => w.children.length > 0)
            .map((wife, i) => ({
                name: wife.name,
                wifeIndex: i,
                children: wife.children.map(child => ({
                    name: child.name,
                    wifeIndex: i,
                    value: (child.children?.length ?? 0) + 1,
                })),
            })),
    }
}

export function ChildrenTreemap({ wives, patriarchName, width }: Props) {
    const [showGrandchildren, setShowGrandchildren] = useState(false)
    const [tooltip, setTooltip] = useState<TooltipState | null>(null)

    const wivesWithChildren = wives.filter(w => w.children.length > 0)
    if (wivesWithChildren.length === 0) return null

    const hasAnyGrandchildren = wives.some(w => w.children.some(c => c.children && c.children.length > 0))

    const treeData = showGrandchildren ? buildGrandchildrenData(wives) : buildChildrenData(wives)
    const root = hierarchy(treeData).sum(d => d.value ?? 0)

    const totalChildren = wives.reduce((sum, w) => sum + w.children.length, 0)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>Children by wife</span>
                <span className={styles.subtitle}>{totalChildren} children across {wivesWithChildren.length} wife{wivesWithChildren.length !== 1 ? "s" : ""}</span>
                {hasAnyGrandchildren && (
                    <button
                        className={styles.toggle}
                        onClick={() => setShowGrandchildren(v => !v)}
                    >
                        {showGrandchildren ? "Show children only" : "Show grandchildren"}
                    </button>
                )}
            </div>
            <svg width={width} height={TREEMAP_HEIGHT} onMouseLeave={() => setTooltip(null)}>
                <rect width={width} height={TREEMAP_HEIGHT} fill={BG} rx={6} />
                <Treemap
                    root={root}
                    size={[width, TREEMAP_HEIGHT]}
                    tile={treemapSquarify}
                    paddingOuter={4}
                    paddingInner={2}
                    round
                >
                    {treemap =>
                        treemap.descendants().map(node => {
                            if (node.depth === 0) return null

                            const nodeW = node.x1 - node.x0
                            const nodeH = node.y1 - node.y0
                            if (nodeW <= 1 || nodeH <= 1) return null

                            const wifeIndex = node.data.wifeIndex
                            const color = WIFE_COLORS[wifeIndex % WIFE_COLORS.length]

                            // In grandchildren mode, depth=1 are wife groups (dimmer border),
                            // depth=2 are child tiles (solid fill)
                            const isLeaf = node.children == null || node.children.length === 0
                            const fillOpacity = isLeaf ? 0.82 : 0.18
                            const strokeColor = isLeaf ? BG : color
                            const strokeWidth = isLeaf ? 2 : 1.5

                            const wife = wives[wifeIndex]
                            const childCount = wife?.children.length ?? 0
                            const grandchildCount = showGrandchildren && isLeaf && node.depth === 2
                                ? (wife?.children.find(c => c.name === node.data.name)?.children?.length ?? 0)
                                : undefined

                            return (
                                <Group
                                    key={`${node.data.name}-${node.depth}`}
                                    left={node.x0}
                                    top={node.y0}
                                >
                                    <rect
                                        width={nodeW}
                                        height={nodeH}
                                        fill={color}
                                        fillOpacity={fillOpacity}
                                        stroke={strokeColor}
                                        strokeWidth={strokeWidth}
                                        style={{ cursor: "default" }}
                                        onMouseEnter={() => {
                                            if (!isLeaf) return
                                            const tooltipWifeIndex = node.depth === 1 ? wifeIndex : wifeIndex
                                            const tooltipWife = wives[tooltipWifeIndex]
                                            setTooltip({
                                                x: node.x0 + nodeW / 2,
                                                y: node.y0,
                                                wifeName: node.depth === 1 ? node.data.name : (wife?.name ?? node.data.name),
                                                childCount: tooltipWife?.children.length ?? 0,
                                                grandchildCount,
                                            })
                                        }}
                                    />
                                    {isLeaf && nodeW > 48 && nodeH > 20 && (
                                        <text
                                            x={nodeW / 2}
                                            y={nodeH / 2}
                                            dy="0.35em"
                                            textAnchor="middle"
                                            fill={AXIS_COLOR}
                                            fontSize={Math.min(11, nodeH * 0.4)}
                                            fontFamily="monospace"
                                            style={{ pointerEvents: "none", userSelect: "none" }}
                                        >
                                            {node.depth === 1
                                                ? `${node.data.name.split(" ")[0]} (${node.value})`
                                                : node.value && node.value > 1
                                                    ? `${node.data.name.split(" ")[0]} (${node.value - 1})`
                                                    : node.data.name.split(" ")[0]}
                                        </text>
                                    )}
                                </Group>
                            )
                        })
                    }
                </Treemap>

                {/* Legend */}
                <Group top={TREEMAP_HEIGHT - 28} left={8}>
                    {wivesWithChildren.slice(0, Math.floor((width - 16) / 120)).map((wife, i) => (
                        <g key={wife.name} transform={`translate(${i * 120}, 0)`}>
                            <rect width={10} height={10} y={-1} fill={WIFE_COLORS[i % WIFE_COLORS.length]} fillOpacity={0.82} />
                            <text x={14} y={8} fill={AXIS_COLOR} fontSize={10} fontFamily="monospace">
                                {wife.name.split(" ")[0]} ({wife.children.length})
                            </text>
                        </g>
                    ))}
                </Group>

                {tooltip && (
                    <SvgTooltip
                        x={tooltip.x}
                        y={tooltip.y}
                        width={160}
                        lines={[
                            { text: tooltip.wifeName },
                            { text: `${tooltip.childCount} child${tooltip.childCount !== 1 ? "ren" : ""}`, dim: true },
                            ...(tooltip.grandchildCount != null
                                ? [{ text: `${tooltip.grandchildCount} grandchild${tooltip.grandchildCount !== 1 ? "ren" : ""}`, dim: true }]
                                : []),
                        ]}
                    />
                )}
            </svg>
        </div>
    )
}
